import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthUser } from '../auth.js'
import { post } from '../api.js'
export default function Login(){ const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const nav = useNavigate();
async function submit(e){ e.preventDefault(); try{ const res = await post('/login',{username,password}); if(res.success){ setAuthUser({username:res.username, role: res.role}); nav('/dashboard'); } else { alert(res.message || 'Login failed') } }catch(er){ console.error(er); alert('Login error') } }
return (<div className="card" style={maxWidth:480,margin:'30px auto'}><h2 className="h2">Login</h2><form onSubmit={submit} style={display:'grid',gap:10}><input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required /><input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required /><div style={display:'flex',gap:8}><button className="btn" type="submit">Login</button></div></form></div>) }
