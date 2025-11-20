import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../auth.js'

export default function Header(){
  const user = getUser()
  const nav = useNavigate()
  return (
    <header className="app-header">
      <div className="brand">Blood Test App</div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        {user ? <div className="muted">Hello, {user.username}</div> : null}
        {user ? <button className="btn btn-ghost" onClick={()=>{ logout(); nav('/login') }}>Logout</button> : <Link to="/login" style={{color:'#fff'}}>Login</Link>}
      </div>
    </header>
  )
}
