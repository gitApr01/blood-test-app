import React from "react";
export default function FilterBar({ filter, setFilter, testByList=[], collectedList=[], onRefresh }){
  return (
    <div className="filters">
      <input placeholder="Search patient/tests" value={filter.q||""} onChange={e=>setFilter({...filter,q:e.target.value})}/>
      <select value={filter.status||"all"} onChange={e=>setFilter({...filter,status:e.target.value})}>
        <option value="all">All status</option>
        <option value="Not Delivered">Not Delivered</option>
        <option value="Partial">Partial</option>
        <option value="Fully Delivered">Fully Delivered</option>
      </select>
      <select value={filter.testBy||"all"} onChange={e=>setFilter({...filter,testBy:e.target.value})}>
        <option value="all">All Labs</option>
        {testByList.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select value={filter.collectedBy||"all"} onChange={e=>setFilter({...filter,collectedBy:e.target.value})}>
        <option value="all">All Collectors</option>
        {collectedList.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="date" value={filter.start||""} onChange={e=>setFilter({...filter,start:e.target.value})}/>
      <input type="date" value={filter.end||""} onChange={e=>setFilter({...filter,end:e.target.value})}/>
      <button className="btn-ghost" onClick={onRefresh}>Refresh</button>
    </div>
  );
}
