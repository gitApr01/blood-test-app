import React from 'react'
export default function FilterBar({q,setQ,fromDate,setFromDate,toDate,setToDate,onApply}){
  return (
    <div className="filter-bar">
      <input placeholder="Search patient" value={q} onChange={e=>setQ(e.target.value)} />
      <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
      <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} />
      <button className="btn btn-primary" onClick={onApply}>Apply</button>
    </div>
  )
}
