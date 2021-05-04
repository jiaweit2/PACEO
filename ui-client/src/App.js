import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "./App.css";
import { Game } from "./components/Game/Game";
import { LoginForm } from "./components/LoginForm";
import { getStompClient, getStompSocket } from "./services/stompClient";

const App = () => {
  const [gameToken, setGameToken] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState({});
  const [hasConnected, setHasConnected] = useState(false);
  const [hasUserList, setHasUserList] = useState(false);

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
        message = message.body;
        let payload = message.split("\t");
        const updatedUsers = JSON.parse(JSON.stringify(users));
        if (payload[0] != username) {
          if (payload[0] in updatedUsers) {
            updatedUsers[payload[0]].x = payload[1];
            updatedUsers[payload[0]].y = payload[2];
          } else {
            updatedUsers[payload[0]] = {
              x: payload[1],
              y: payload[2],
            };
          }
        }
        setUsers(updatedUsers);
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

  const handleOnLogin = (sessionToken, name) => {
    setGameToken(sessionToken);
    setUsername(name);
  };

  const handleOnLeave = () => {
    disconnectWebsocket();
    window.location.reload();
  };

  let content;

  if (!username) {
    content = <LoginForm onLogin={handleOnLogin} onLeave={handleOnLeave} />;
  } else if (hasConnected && hasUserList) {
    content = <Game token={gameToken} username={username} />;
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
