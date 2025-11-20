import React, {useEffect,useState} from "react";
import Header from "../components/Header";
export default function Reports(){
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const [data,setData]=useState([]);
  useEffect(()=>{ load(); },[month]);
  async function load(){
    try{
      const r = await fetch("https://blood-test-app.onrender.com/all_tests");
      const all = await r.json();
      const filtered = all.filter(x => (x.created_at||x.date||"").slice(0,7) === month);
      const map = {}; filtered.forEach(e=>{ const c=e.collected_by||'Unknown'; if(!map[c]) map[c]={collectedBy:c,total:0,adminShare:0,entries:[]}; map[c].total += Number(e.total||0); map[c].adminShare += Number(((e.total||0) * 0.4).toFixed(2)); map[c].entries.push(e); });
      const arr = Object.values(map); arr.forEach(a=>{ a.commissionPaid = 0; a.commissionDue = a.adminShare; });
      setData(arr);
    }catch(e){console.error(e); alert("load fail");}
  }
  function setPaid(i,val){ const a=[...data]; a[i].commissionPaid = Number(val||0); a[i].commissionDue = Number((a[i].adminShare - a[i].commissionPaid).toFixed(2)); setData(a); }
  return (<><Header title="Reports"/><div className="container"><div className="card"><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="month" value={month} onChange={e=>setMonth(e.target.value)}/><button className="btn-ghost" onClick={load}>Refresh</button></div></div><div className="card">{data.length===0? <div className="muted">No data</div> : data.map((d,idx)=> (<div key={d.collectedBy} style={{display:"flex",justifyContent:"space-between",padding:10,borderBottom:"1px dashed #eef2f7"}}><div><div style={{fontWeight:700}}>{d.collectedBy}</div><div className="muted small">Total: ₹{d.total.toFixed(2)}</div><div className="muted small">Admin Share (40%): ₹{d.adminShare.toFixed(2)}</div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="number" value={d.commissionPaid} onChange={e=>setPaid(idx,e.target.value)} /><div className="small muted">Due: ₹{d.commissionDue?.toFixed(2)||"0.00"}</div></div></div>))}</div></div></>);
}
