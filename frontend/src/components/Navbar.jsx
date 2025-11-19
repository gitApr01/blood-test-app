// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ username, onLogout }) {
  const nav = useNavigate();
  return (
    <header className="app-header">
      <div className="left">
        <button className="hamburger" onClick={() => document.body.classList.toggle("nav-open")}>☰</button>
        <div className="brand">Invoices</div>
      </div>

      <div className="center-tabs" aria-hidden>
        <nav className="tabs">
          <Link to="/tests?tab=unpaid" className="tab">Unpaid</Link>
          <Link to="/tests?tab=paid" className="tab">Paid</Link>
          <Link to="/tests?tab=draft" className="tab">Draft</Link>
          <Link to="/tests?tab=all" className="tab active">All</Link>
        </nav>
      </div>

      <div className="right">
        <button className="icon-btn">⇅</button>
        <button className="icon-btn">🔍</button>
        <div className="user-block">
          <span className="username">{username || "Guest"}</span>
          <button className="link-btn" onClick={() => { onLogout && onLogout(); nav("/"); }}>Logout</button>
        </div>
      </div>
    </header>
  );
}
