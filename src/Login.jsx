import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      username: username,
      password: password,
    };
    console.log(postData);
    try {
      const resp = await axios.post("http://localhost:8080/api/auth/login", postData);
      const data = resp.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh-token", data.refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Error logging in", error);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              required
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
            <label>Password</label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
