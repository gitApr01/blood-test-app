// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AllTests from "./pages/AllTests";
import AddTest from "./pages/AddTest";
import Reports from "./pages/Reports";
import API from "./api";

function AppInner() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // restore from localStorage if present
    const u = localStorage.getItem("username");
    const id = localStorage.getItem("userid");
    const role = localStorage.getItem("role");
    if (u) setUser({ username: u, id, role });
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("username", u.username);
    localStorage.setItem("userid", u.id);
    localStorage.setItem("role", u.role);
    nav("/tests");
  };

  const handleLogout = async () => {
    await API.logout();
    localStorage.clear();
    setUser(null);
    nav("/");
  };

  return (
    <div>
      <Navbar username={user?.username} onLogout={handleLogout} />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/tests" element={<AllTests user={user} />} />
          <Route path="/add" element={<AddTest user={user} />} />
          <Route path="/reports" element={<Reports user={user} />} />
        </Routes>
      </main>

      {/* Floating action button */}
      <div className="fab" title="Add test" onClick={() => { window.location = "/add"; }}>
        <div className="fab-plus">+</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
