import React, {useEffect, useState} from 'react'
import TestCard from '../components/TestCard'
export default function AllTests(){
  const [rows,setRows]=useState([])
  useEffect(()=>{ fetch('https://blood-test-app.onrender.com/all_tests').then(r=>r.json()).then(setRows).catch(()=>{}) },[])
  return (
    <div className="container">
      <div className="card"><h2>All Tests</h2></div>
      {rows.length===0 ? <div className="card small">No records</div> : rows.map(r=> <TestCard key={r.id} t={r} />)}
    </div>
  )
}
