import React from 'react'
import { Link } from 'react-router-dom'
import { getAuthUser, logout } from '../auth.js'
export default function Header(){ const user = getAuthUser(); return (<header className="header"><div className="title">Blood Test App</div><div style={{marginLeft:'auto',display:'flex',gap:10,alignItems:'center'}}>{user? <div className="small">Hi, {user.username}</div>:null}{user? <button className="btn" onClick={logout}>Logout</button>: <Link className="btn" to="/login">Login</Link>}</div></header>) }
