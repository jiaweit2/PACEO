import { connectToSession } from "../../services/openVidu";
import React, { useEffect } from "react";
import "./Game.css";

export const Game = ({ username, token, onLeave }) => {
  useEffect(() => {
    connectToSession(token, username);
  }, []);

  return (
    <div className="game">
      <div id="user-videos-container"></div>
    </div>
  );
};
