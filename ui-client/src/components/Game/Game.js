import { connectToSession } from "../../services/openVidu";
import React, { useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import "./Game.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const Game = ({ username, token, onLeave }) => {
  var stompClient = null;
  var x = 0;
  var y = 0;
  var users = {};
  var sessionID = "";

  // Experiments
  var total = 0;
  var num = 0;

  const handleKey = (e) => {
    switch (e.code) {
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
    if (stompClient != null) {
      stompClient.send("/app/pos", {}, username + "\t" + x + "\t" + y + "\t" + Date.now());
    }
  };

  const connectWebsocket = () => {
    var socket = SockJS("/sockjs");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function () {
      sessionID = socket._transport.url.split("/").pop();

      stompClient.send("/app/userJoin", {}, username + "\t" + sessionID);

      stompClient.subscribe('/topic/userCurrList', (message) => {
        message = message.body;
        if (message.substr(0, 5) == "LEAVE") {
          // A user has left
          delete users[message.split("\t")[1]]
        } else {
          users = {};
          let payload = message.split("\n");
          payload.forEach(element => {
            if (element != "") {
              let userMeta = element.split("\t");
              users[userMeta[0]] = {
                x: userMeta[1],
                y: userMeta[2],
              }
            }
          });
        }
        console.log("Current Users:", users);
      });

      stompClient.subscribe('/topic/pos', (message) => {
        message = message.body;
        let payload = message.split("\t");
        if (payload[0] != username) {
          if (payload[0] in users) {
            users[payload[0]].x = payload[1]
            users[payload[0]].y = payload[2]
          } else {
            users[payload[0]] = {
              x: payload[1],
              y: payload[2]
            }
          }
          let diff = Date.now() - parseFloat(payload[3]);
          total += diff;
          num += 1;
          console.log("Msg Latency: " + (diff));
        }
      });
    });
  };

  const disconnectWebsocket = () => {
    if (stompClient !== null && stompClient.state === 0) {
      stompClient.disconnect();
    }
    console.log("Disconnected", username);
  }

  useEffect(() => {
    // Issue: useEffect() is called twice when started?
    if (username.length == 0) {
      console.warn("Username is EMPTY");
      return;
    }
    connectToSession(token, username);
    connectWebsocket();
    window.addEventListener("keydown", handleKey);

    return function cleanup() {
      window.removeEventListener('keydown', handleKey);
    };
  });

  const logout = () => {
    disconnectWebsocket();
    window.location.reload();
  }



  return (
    <div className="game">
      <Navbar fixed="top" bg="light" expand="lg">
        <Navbar.Brand href="#home">PACEO</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div id="user-videos-container" className="video"></div>
    </div>
  );
};
