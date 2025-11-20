import React, {useState} from "react";
import { saveUser } from "../auth";
import { useNavigate } from "react-router-dom";
export default function Login(){
  const [username,setUsername]=useState(""); const [password,setPassword]=useState("");
  const nav = useNavigate();
  async function submit(){
    if(!username||!password){ alert("Enter both"); return; }
    try{
      const res = await fetch("https://blood-test-api.onrender.com/login", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username,password})});
      const data = await res.json();
      if(data.success){ saveUser({username:data.username, role:data.role}); nav("/dashboard"); }
      else alert(data.message || "Invalid credentials");
    }catch(e){ console.error(e); alert("Login error"); }
  }
  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <label className="label">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username"/>
        <label className="label">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password"/>
        <div style={{marginTop:10,display:"flex",gap:8}}>
          <button className="btn-primary" onClick={submit}>Login</button>
        </div>
      </div>
    </div>
  );
}
