import { connectToSession } from "../../services/openVidu";
import { useEffect } from "react";

export const Game = ({ username, token, onLeave }) => {
  useEffect(() => {
    connectToSession(token, username);
  }, []);
  return (
    <div className="game">
      <div id="user-videos-container" className="video"></div>
    </div>
  );
};
