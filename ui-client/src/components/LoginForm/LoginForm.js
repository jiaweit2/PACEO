import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { joinGame } from "../../services/auth";
import "./LoginForm.css";

export const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const handleOnJoin = async () => {
    const loginResponse = await joinGame(username);
    if (loginResponse && onLogin) {
      onLogin(loginResponse);
    }
  };
  return (
    <form className="login-form">
      <TextField
        id="standard-basic"
        label="Username"
        className="login-form__field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        className="login-form__join-btn"
        onClick={handleOnJoin}
        variant="contained"
        color="primary"
      >
        Join Game
      </Button>
    </form>
  );
};
