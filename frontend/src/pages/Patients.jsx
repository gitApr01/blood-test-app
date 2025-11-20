import React,{useEffect,useState} from "react";
import Header from "../components/Header";
export default function Patients(){
  const [list,setList]=useState([]);
  useEffect(()=>{ async function l(){ try{ const r=await fetch("https://blood-test-api.onrender.com/all_tests"); const j=await r.json(); const byName = {}; j.forEach(it=>{ if(!byName[it.patient_name]) byName[it.patient_name]=it; }); setList(Object.values(byName)); }catch(e){console.error(e);} } l(); },[]);
  return (<><Header title="Patients"/><div className="container"><div className="card">{list.length===0? <div className="muted">No patients</div> : list.map(p=> <div key={p.id} className="list-item"><div>{p.patient_name}</div><div className="muted">Last: {new Date(p.created_at||p.date||Date.now()).toLocaleDateString()}</div></div>)}</div></div></>);
}
