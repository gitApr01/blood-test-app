import React, {useEffect,useState} from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import TestCard from "../components/TestCard";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";

export default function Dashboard(){
  const [reports,setReports]=useState([]); const [filter,setFilter]=useState({}); const [loading,setLoading]=useState(false);

  async function load(){
    setLoading(true);
    try{
      const r = await fetch("https://blood-test-api.onrender.com/all_tests");
      const j = await r.json();
      setReports(j);
    }catch(e){ console.error(e); alert("Load failed"); }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  const testByList = Array.from(new Set(reports.map(r=>r.test_by).filter(Boolean)));
  const collectedList = Array.from(new Set(reports.map(r=>r.collected_by).filter(Boolean)));

  function filtered(){
    return reports.filter(r=>{
      if(filter.q){
        const q = filter.q.toLowerCase();
        if(!(r.patient_name?.toLowerCase?.().includes(q) || (r.tests_selected||"").toLowerCase().includes(q))) return false;
      }
      if(filter.status && filter.status!=='all' && r.delivery_status !== filter.status) return false;
      if(filter.testBy && filter.testBy!=='all' && r.test_by !== filter.testBy) return false;
      if(filter.collectedBy && filter.collectedBy!=='all' && r.collected_by !== filter.collectedBy) return false;
      if(filter.start){ if(new Date(r.created_at||r.date||Date.now()) < new Date(filter.start)) return false; }
      if(filter.end){ const end=new Date(filter.end); end.setHours(23,59,59,999); if(new Date(r.created_at||r.date||Date.now()) > end) return false; }
      return true;
    }).sort((a,b)=> new Date(b.created_at||b.date||0) - new Date(a.created_at||a.date||0));
  }

  return <>
    <Header title="Dashboard" />
    <div className="container">
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2>All Tests</h2>
          <a href="/add"><button className="btn-primary">+ Add</button></a>
        </div>
        <FilterBar filter={filter} setFilter={setFilter} testByList={testByList} collectedList={collectedList} onRefresh={load}/>
      </div>

      <div className="card">
        {loading ? <Loader/> : (filtered().length===0 ? <div className="muted">No entries</div> : filtered().map(r=> <TestCard key={r.id} r={r}/>))}
      </div>
    </div>

    <BottomNav />
    <a className="fab" href="/add">+</a>
  </>;
}
