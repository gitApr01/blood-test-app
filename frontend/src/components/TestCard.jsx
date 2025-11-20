import React from "react";
import { useNavigate } from "react-router-dom";
export default function TestCard({ r }){
  const nav = useNavigate();
  const tests = (r.tests || r.tests_selected || "").toString();
  return (
    <div className="list-item" onClick={()=>nav(`/edit/${r.id}`)} style={{cursor:"pointer"}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:700}}>{r.patient_name}</div>
            <div className="muted small">{tests}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:700}}>₹ {Number(r.total||0).toFixed(2)}</div>
            <div className="muted small">Due ₹ {Number(r.due||0).toFixed(2)}</div>
          </div>
        </div>
        <div style={{marginTop:8}} className="muted small">Collected: {r.collected_by || '—'} • {new Date(r.created_at||r.date||Date.now()).toLocaleString()}</div>
      </div>
      <div style={{width:120,textAlign:"right"}}>
        <div className="small">{r.delivery_status}</div>
      </div>
    </div>
  );
}
