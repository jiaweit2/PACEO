import { connectToSession } from "../../services/openVidu";
import React, { useEffect } from "react";
import "./Game.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const Game = ({ username, token, onLeave }) => {
  var stompClient = null;
  var x = 0;
  var y = 0;

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
      stompClient.send("/app/pos", {}, username + "\t" + x + "\t" + y);
    }
  };

  const connectWebsocket = () => {
    var socket = SockJS("/sockjs");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function () {
      stompClient.subscribe("/topic/pos", (message) => {
        message = message.body;
        let payload = message.split("\t");
        if (payload[0] != username) {
          console.log("Receive message: " + message);
        }
      });
    });
  };

  const disconnectWebsocket = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    console.log("Disconnected");
  };

  useEffect(() => {
    connectToSession(token, username);
    connectWebsocket();
    window.addEventListener("keydown", handleKey);

    return function cleanup() {
      window.removeEventListener("keydown", handleKey);
      disconnectWebsocket();
    };
  }, []);

  return (
    <div className="game">
      <div id="user-videos-container"></div>
    </div>
  );
};
