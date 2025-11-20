import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function TestCard({r}){
  const nav = useNavigate()
  return (
    <div className="test-row" onClick={()=>nav(`/edit/${r.id}`)} style={{cursor:'pointer'}}>
      <div>
        <div style={{fontWeight:700}}>{r.patient_name}</div>
        <div className="muted">{r.tests?.map(t=>t.name).join(', ')}</div>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontWeight:700}}>₹{r.total}</div>
        <div className="muted">{new Date(r.created_at).toLocaleDateString()}</div>
      </div>
    </div>
  )
}
