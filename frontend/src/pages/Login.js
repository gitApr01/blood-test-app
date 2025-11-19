// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e?.preventDefault();
    const res = await API.login(username, password);
    if (res && res.success) {
      const user = { username: res.username, id: res.id, role: res.role };
      onLogin && onLogin(user);
      nav("/tests");
    } else {
      alert(res?.message || "Invalid username or password");
    }
  };

  return (
    <div className="card login-card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button className="btn primary" type="submit">Login</button>
          <button className="btn" type="button" onClick={()=>{ setUsername("admin"); setPassword("admin123"); }}>Fill admin</button>
        </div>
      </form>
    </div>
  );
}
