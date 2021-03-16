import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { joinGame } from "../../services/auth";
import "./LoginForm.css";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const handleOnJoin = () => {
    joinGame(username);
  };
  return (
    <form className="JOIN_GAME-form">
      <TextField
        id="standard-basic"
        label="Username"
        className="JOIN_GAME-form__field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        className="JOIN_GAME-form__join-btn"
        onClick={handleOnJoin}
        variant="contained"
        color="primary"
      >
        Join Game
      </Button>
    </form>
  );
};
