import { connectToSession } from "../../services/openVidu";
import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./Game.css";
import { initScene, addObjectToScene } from "../../services/backgroundScene";
import { createFaceCube, addNewUserFaceCube } from "../../services/addModel";

let keyboard = {};

export const Game = ({
  username,
  token,
  onLeave,
  initialPosition: { initialX, initialY },
}) => {
  useEffect(() => {
    if (username.length === 0) {
      console.warn("Username is EMPTY");
      return;
    }
    const setupGameScene = async () => {
      initScene(username);
      let videoElement = await connectToSession(
        token,
        username,
        addNewUserFaceCube
      );
      const userFaceCube = createFaceCube(
        videoElement,
        initialX,
        initialY,
        true
      );
      addObjectToScene(userFaceCube);
    };
    setupGameScene();
  }, [initialX, initialY]);

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
