import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "./App.css";
import { Game } from "./components/Game/Game";
import { LoginForm } from "./components/LoginForm";
import { setUserCubePositions } from "./services/addModel";
import { getStompClient, getStompSocket } from "./services/stompClient";

const App = () => {
  const [gameToken, setGameToken] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState({});
  const [hasConnected, setHasConnected] = useState(false);
  const [hasUserList, setHasUserList] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);

  const connectWebsocket = () => {
    var stompSocket = getStompSocket();
    const stompClient = getStompClient();
    stompClient.connect({}, function () {
      console.log(`${username} connected`);
      const sessionID = stompSocket._transport.url.split("/").pop();

      stompClient.subscribe("/topic/userCurrList", (message) => {
        const updatedUsersFromServer = JSON.parse(message.body);
        const updatedUsers = JSON.parse(JSON.stringify(users));
        for (const { name, pos } of updatedUsersFromServer) {
          updatedUsers[name] = {
            x: pos[0],
            y: pos[1],
          };
        }
        setUsers(updatedUsers);
        console.log("Current Users:", updatedUsers);
        setHasUserList(true);
      });

      stompClient.subscribe("/topic/pos", (message) => {
        const newUserPositions = JSON.parse(message.body);
        setUsers(newUserPositions);
        console.log("UPDATED POSITIONS", newUserPositions);
        setUserCubePositions(newUserPositions, username);
      });

      stompClient.send("/app/userJoin", {}, username + "\t" + sessionID);
      setHasConnected(true);
    });
  };

  const disconnectWebsocket = () => {
    const stompClient = getStompClient();
    if (stompClient !== null && stompClient.state === 0) {
      stompClient.disconnect();
    }
    console.log("Disconnected", username);
  };

  useEffect(() => username && connectWebsocket(), [username]);

  const handleOnLogin = (loginResponse, name) => {
    const {
      token: sessionToken,
      openViduServerData: { initialX, initialY },
    } = loginResponse;
    setGameToken(sessionToken);
    setUsername(name);
    setInitialPosition({
      initialX,
      initialY,
    });
  };

  const handleOnLeave = () => {
    disconnectWebsocket();
    window.location.reload();
  };

  let content;

  if (!username) {
    content = <LoginForm onLogin={handleOnLogin} onLeave={handleOnLeave} />;
  } else if (hasConnected && hasUserList) {
    content = (
      <Game
        token={gameToken}
        username={username}
        initialPosition={initialPosition}
      />
    );
  } else if (!hasConnected) {
    content = (
      <div className="app__loading">
        Connecting to game...
        <Spinner />
      </div>
    );
  } else {
    content = (
      <div className="app__loading">
        Fetching list of players...
        <Spinner />
      </div>
    );
  }

  return <div className="App">{content}</div>;
};

export default App;
