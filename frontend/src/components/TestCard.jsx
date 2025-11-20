import React from 'react'
export default function TestCard({t}){
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div><strong>{t.patient_name}</strong><div className="small">{t.created_at}</div></div>
        <div className="small">₹ {t.total}</div>
      </div>
    </div>
  )
}
