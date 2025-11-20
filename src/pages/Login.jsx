import React, {useState} from 'react'
import { saveUser } from '../auth.js'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  async function submit(){
    if(!username||!password){ alert('Enter both'); return }
    try{
      const data = await apiFetch('/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username,password})})
      if(data && data.success){ saveUser({id:data.id, username:data.username, role:data.role}); nav('/dashboard') }
      else alert(data?.message || 'Invalid credentials')
    }catch(e){ console.error(e); alert('Login failed') }
  }

  return (
    <div style={{maxWidth:480,margin:'40px auto'}}>
      <div className="card">
        <h2>Login</h2>
        <label className="label">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} />
        <label className="label">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={submit}>Login</button>
        </div>
      </div>
    </div>
  )
}
