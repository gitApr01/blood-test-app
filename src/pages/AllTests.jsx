import React, {useState, useEffect} from 'react'
import FilterBar from '../components/FilterBar.jsx'
import TestCard from '../components/TestCard.jsx'
import Loader from '../components/Loader.jsx'
import { apiFetch } from '../api.js'

export default function AllTests(){
  const [q,setQ]=useState('')
  const [fromDate,setFromDate]=useState('')
  const [toDate,setToDate]=useState('')
  const [rows,setRows]=useState(null)

  async function load(){
    setRows(null)
    try{
      const qs = new URLSearchParams()
      if(q) qs.set('q',q)
      if(fromDate) qs.set('from_date',fromDate)
      if(toDate) qs.set('to_date',toDate)
      const data = await apiFetch('/all_tests?'+qs.toString(), {method:'GET'})
      setRows(data || [])
    }catch(e){ console.error(e); setRows([]) }
  }

  useEffect(()=>{ load() },[])

  return (
    <div>
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>All Tests</h2>
          <div style={{display:'flex',gap:8}}>
            <a className="btn" href="/add-test">Add Test</a>
          </div>
        </div>

        <FilterBar q={q} setQ={setQ} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} onApply={load} />

        {rows===null ? <Loader/> : (
          rows.length ? <div className="tests-list">{rows.map(r=> <TestCard key={r.id} r={r} />)}</div> : <div className="muted">No tests found</div>
        )}
      </div>
    </div>
  )
}
