import { connectToSession } from "../../services/openVidu";
import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./Game.css";
import {
  initScene,
  getGameSceneProperties,
  addObjectToScene,
} from "../../services/backgroundScene";
import { createFaceCube, addNewUserFaceCube } from "../../services/addModel";

let keyboard = {};

export const Game = ({ username, token, onLeave }) => {
  var x = 0;
  var y = 0; // actually z

  const handleKey = (e) => {
    // handled in backgroundScene.js
    keyboard[e.code] = true;
    console.log(e.code + " PRESSED by " + username);
    /*switch (e.code) {
      case "ArrowLeft":
        x--;
        break;
      case "ArrowUp":
        y++;
        break;
      case "ArrowRight":
        x++;
        break;
      case "ArrowDown":
        y--;
        break;
      default:
        return;
    }
    const stompClient = getStompClient();
    if (stompClient != null) {
      stompClient.send("/app/pos", {}, username + "\t" + x + "\t" + y);
    }*/
  };

  useEffect(() => {
    // Issue: useEffect() is called twice when started?
    if (username.length === 0) {
      console.warn("Username is EMPTY");
      return;
    }
    window.addEventListener("keydown", handleKey);
    const setupGameScene = async () => {
      initScene(username);
      let videoElement = await connectToSession(
        token,
        username,
        addNewUserFaceCube
      );
      const userFaceCube = createFaceCube(videoElement);
      addObjectToScene(userFaceCube);
    };
    setupGameScene();
    return function cleanup() {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="game">
      <Navbar fixed="top" bg="light" expand="lg">
        <Navbar.Brand href="#home">PACEO</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link onClick={onLeave}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div id="user-videos-container" className="video"></div>
    </div>
  );
};
