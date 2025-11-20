import React from 'react'
import { apiFetch } from '../api.js'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'

export default function Users(){
  const [rows,setRows]=useState(null)
  useEffect(()=>{ (async()=>{ try{ const u = await apiFetch('/users'); setRows(u||[]) }catch(e){ setRows([]) } })() },[])
  if(rows===null) return <Loader/>
  return (
    <div className="card">
      <h2>Users</h2>
      {rows.length ? rows.map(r=> <div key={r.id} style={{padding:8,borderBottom:'1px solid #f3f6fb'}}>{r.username} — {r.role}</div>) : <div className="muted">No users</div>}
    </div>
  )
}
