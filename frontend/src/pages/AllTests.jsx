import React,{useEffect,useState} from "react";
import Header from "../components/Header";
import TestCard from "../components/TestCard";
import Loader from "../components/Loader";

export default function AllTests(){
  const [data,setData]=useState([]); const [loading,setLoading]=useState(false);
  async function load(){ setLoading(true); try { const r = await fetch("https://blood-test-app.onrender.com/all_tests"); const j=await r.json(); setData(j);} catch(e){console.error(e);} setLoading(false); }
  useEffect(()=>{ load(); },[]);
  return <>
    <Header title="All Tests"/>
    <div className="container">
      <div className="card">{loading? <Loader/> : (data.length===0? <div className="muted">No records</div> : data.map(r=> <TestCard key={r.id} r={r}/>))}</div>
    </div>
  </>
}
