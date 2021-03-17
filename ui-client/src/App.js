import { useState } from "react";
import "./App.css";
import { Game } from "./components/Game/Game";
import { LoginForm } from "./components/LoginForm";

const App = () => {
  const [isInGame, setIsInGame] = useState(false);

  const handleOnLogin = (loginResponse) => {
    setIsInGame(true);
  };

  return (
    <div className="App">
      {isInGame ? <Game /> : <LoginForm onLogin={handleOnLogin} />}
    </div>
  );
};

export default App;
