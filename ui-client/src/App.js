import { useState } from "react";
import "./App.css";
import { Game } from "./components/Game/Game";
import { LoginForm } from "./components/LoginForm";

const App = () => {
  const [gameToken, setGameToken] = useState(false);
  const [username, setUsername] = useState("");

  const handleOnLogin = (sessionToken, name) => {
    setGameToken(sessionToken);
    setUsername(name);
  };

  // To be implemented
  const handleOnLeave = () => console.log("leaving game");

  return (
    <div className="App">
      {gameToken ? (
        <Game token={gameToken} username={username} />
      ) : (
        <LoginForm onLogin={handleOnLogin} onLeave={handleOnLeave} />
      )}
    </div>
  );
};

export default App;
