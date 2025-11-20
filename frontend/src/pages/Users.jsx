import React, {useEffect, useState} from 'react'
export default function Users(){
  const [users,setUsers]=useState([])
  useEffect(()=>{ fetch('https://blood-test-app.onrender.com/users').then(r=>r.json()).then(setUsers).catch(()=>{}) },[])
  return (
    <div className="container">
      <div className="card"><h2>Users</h2></div>
      {users.map(u=> <div className="card small" key={u.id}>{u.username} — {u.role}</div>)}
    </div>
  )
}
