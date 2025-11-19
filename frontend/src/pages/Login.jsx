import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit() {
    if(!username || !password){ alert("fill both"); return; }
    try {
      const res = await api.post("/login", { username, password });
      if (res.data && res.data.success) {
        onLogin({ username: res.data.username, role: res.data.role });
        nav("/");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login error");
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <label className="label">Username</label>
      <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" />
      <label className="label">Password</label>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" />
      <div style={{marginTop:10, display:"flex", gap:8}}>
        <button className="btn-primary" onClick={submit}>Login</button>
      </div>
      <div style={{marginTop:10}} className="muted">Default admin: admin / admin123 (if created in backend)</div>
    </div>
  );
}
