// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ username, onLogout }) {
  const loc = useLocation();
  const active = (p) => (loc.pathname.startsWith(p) ? "tab active" : "tab");

  return (
    <header className="app-header">
      <div className="left">
        <button className="hamburger" onClick={() => document.body.classList.toggle("nav-open")}>☰</button>
        <div className="brand">Invoices</div>
      </div>

      <div className="center-tabs">
        <nav className="tabs" role="tablist" aria-hidden>
          <Link to="/tests?tab=unpaid" className={active("/tests")}>Unpaid</Link>
          <Link to="/tests?tab=paid" className={active("/tests")}>Paid</Link>
          <Link to="/tests?tab=draft" className={active("/tests")}>Draft</Link>
          <Link to="/tests" className={active("/tests")}>All</Link>
        </nav>
      </div>

      <div className="right">
        <button className="icon-btn">⇅</button>
        <button className="icon-btn">🔍</button>
        <div className="user-block">
          <span className="username">{username || "Guest"}</span>
          <button className="link-btn" onClick={() => onLogout && onLogout()}>Logout</button>
        </div>
      </div>
    </header>
  );
}
