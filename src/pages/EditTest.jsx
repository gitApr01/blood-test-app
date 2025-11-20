import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api.js'

export default function EditTest(){
  const {id} = useParams()
  const nav = useNavigate()
  const [row,setRow] = useState(null)

  useEffect(()=>{ (async()=>{ try{ const data = await apiFetch('/all_tests'); const found = (data||[]).find(x=>x.id===parseInt(id)); setRow(found||null) }catch(e){ setRow(null) } })() },[id])

  if(!row) return <div className="muted">Loading…</div>

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Edit Test</h2>
        <div><button className="btn btn-ghost" onClick={()=>nav(-1)}>Back</button></div>
      </div>
      <div style={{marginTop:8}}>
        <div><strong>Patient:</strong> {row.patient_name}</div>
        <div className="muted">Tests: {row.tests?.map(t=>t.name).join(', ')}</div>
        <div style={{marginTop:8}}>Total: ₹{row.total} | Due: ₹{row.due}</div>
      </div>
    </div>
  )
}
