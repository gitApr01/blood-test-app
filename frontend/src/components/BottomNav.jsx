import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function BottomNav(){
  const nav = useNavigate()
  return (
    <div className="bottom-nav">
      <div className="nav-item" onClick={()=>nav('/dashboard')}>Home</div>
      <div className="nav-item" onClick={()=>nav('/tests')}>Tests</div>
      <div className="nav-item" onClick={()=>nav('/reports')}>Reports</div>
      <div className="nav-item" onClick={()=>nav('/patients')}>Patients</div>
    </div>
  )
}
