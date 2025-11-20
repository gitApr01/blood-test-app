import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit() {
    if (!username || !password) {
      alert("Enter both fields");
      return;
    }

    try {
      const res = await fetch(
        "https://blood-test-app.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      const data = await res.json();

      if (data.success) {
        saveUser({
          id: data.id,
          username: data.username,
          role: data.role
        });
        nav("/dashboard");
      } else {
        alert(data.message || "Invalid Login");
      }
    } catch (e) {
      alert("Login error");
      console.error(e);
    }
  }

  return (
    <div className="container">
      <div className="card login-card">
        <h2>Login</h2>

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={submit}>
          Login
        </button>
      </div>
    </div>
  );
}
