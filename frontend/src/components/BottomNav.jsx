import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function BottomNav(){ const nav = useNavigate(); return (<div className="bottom-nav" aria-hidden><div className="inner"><button className="btn" onClick={()=>nav('/tests')}>Tests</button><button className="btn" onClick={()=>nav('/patients')}>Patients</button><button className="float-add" title="Add test" onClick={()=>nav('/tests/add')}>+</button><button className="btn" onClick={()=>nav('/reports')}>Reports</button><button className="btn" onClick={()=>nav('/users')}>Users</button></div></div>) }
