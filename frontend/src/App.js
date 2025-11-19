import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTest from "./pages/AddTest";
import Reports from "./pages/Reports";

function TopBar({ user, setUser, onMenu }) {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="brand">Blood Test App</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {user ? (
          <>
            <div className="muted">Hi, {user.username}</div>
            <div className="menu">
              <button className="btn-ghost" onClick={onMenu}>☰</button>
            </div>
          </>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // user stored simply in state; for a persistent app use localStorage with tokens
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bt_user"));
    } catch { return null; }
  });

  const handleSetUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem("bt_user", JSON.stringify(u));
    else localStorage.removeItem("bt_user");
  };

  return (
    <BrowserRouter>
      <TopBar user={user} setUser={handleSetUser} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleSetUser} />} />
          <Route path="/add" element={<AddTest user={user} />} />
          <Route path="/reports" element={<Reports user={user} />} />
          <Route path="/" element={<Dashboard user={user} />} />
        </Routes>
      </div>

      <a className="fab" href="/add">+</a>
    </BrowserRouter>
  );
}
