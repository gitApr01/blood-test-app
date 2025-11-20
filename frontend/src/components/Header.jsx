import React from "react";
import { logoutUser } from "../auth";
import { getUser } from "../auth";
export default function Header({ title }){
  const user = getUser();
  return (
    <div className="head">
      <div style={{fontWeight:700}}>{title}</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <div className="muted">{user?.username}</div>
        <button className="btn-ghost" onClick={logoutUser}>Logout</button>
      </div>
    </div>
  );
}
