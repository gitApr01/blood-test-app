import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const TEST_OPTIONS = [
  { key:"TC", label:"TC", price:150 },
  { key:"DC", label:"DC", price:120 },
  { key:"ESR", label:"ESR", price:90 },
  { key:"Hb%", label:"Hb%", price:160 },
  { key:"LFT", label:"LFT", price:600 },
  { key:"LIPID PROFILE", label:"LIPID PROFILE", price:800 },
  { key:"UREA", label:"UREA", price:70 },
  { key:"CREATININE", label:"CREATININE", price:100 },
  { key:"CALCIUM", label:"CALCIUM", price:120 },
  { key:"FSH", label:"FSH", price:400 },
  { key:"RA FACTOR", label:"RA FACTOR", price:200 },
  { key:"CRP", label:"CRP", price:300 },
  { key:"ASO", label:"ASO", price:250 },
];

export default function Dashboard({ user }) {
  const [reports, setReports] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState({ status:"all", testBy:"all", collectedBy:"all", start:"", end:"" });
  const [totals, setTotals] = useState({ total:0, advance:0, due:0 });
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try {
      const res = await api.get("/all_tests");
      setReports(res.data || []);
      recalc(res.data || []);
    } catch(e){ console.error(e); alert("Failed to load"); }
    setLoading(false);
  }

  function recalc(list){
    let total=0, advance=0, due=0;
    list.forEach(r => { total += Number(r.total||0); advance += Number(r.advance||0); due += Number(r.due||0); });
    setTotals({ total, advance, due });
  }

  function filtered(){
    return reports.filter(r=>{
      if (q && !(`${r.patient_name}`.toLowerCase().includes(q.toLowerCase()) || `${r.tests?.join(",")}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (filter.status !== "all" && r.delivery_status !== filter.status) return false;
      if (filter.testBy !== "all" && r.test_by !== filter.testBy) return false;
      if (filter.collectedBy !== "all" && r.collected_by !== filter.collectedBy) return false;
      if (filter.start) {
        const d = new Date(r.created_at || r.date || r.createdAt || Date.now());
        if (d < new Date(filter.start)) return false;
      }
      if (filter.end) {
        const d = new Date(r.created_at || r.date || Date.now());
        const endd = new Date(filter.end); endd.setHours(23,59,59,999);
        if (d > endd) return false;
      }
      return true;
    });
  }

  async function updateStatus(id, status){
    try {
      await api.put(`/update_status/${id}`, { status });
      load();
    } catch(e){ alert("Failed to update"); }
  }

  // collect unique values
  const uniqueTestBy = Array.from(new Set(reports.map(r=>r.test_by).filter(Boolean)));
  const uniqueCollected = Array.from(new Set(reports.map(r=>r.collected_by).filter(Boolean)));

  return (
    <div>
      <div className="card">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2>Invoices</h2>
          <div style={{display:"flex", gap:8}}>
            <Link to="/reports"><button className="btn-ghost">Reports</button></Link>
            <Link to="/add"><button className="btn-primary">+ Add</button></Link>
          </div>
        </div>

        <div style={{marginTop:8}} className="search">
          <input placeholder="Search patient or tests" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="btn-ghost" onClick={()=>load()}>Refresh</button>
        </div>

        <div className="filters">
          <div className="chip" onClick={()=>setFilter({...filter, status:"all"})}>All</div>
          <div className="chip" onClick={()=>setFilter({...filter, status:"Paid"})}>Paid</div>
          <div className="chip" onClick={()=>setFilter({...filter, status:"Not Delivered"})}>Not Delivered</div>
          <div className="chip" onClick={()=>setFilter({...filter, status:"Partial"})}>Partial</div>

          <select value={filter.testBy} onChange={(e)=>setFilter({...filter, testBy: e.target.value})}>
            <option value="all">All Labs</option>
            {uniqueTestBy.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={filter.collectedBy} onChange={(e)=>setFilter({...filter, collectedBy:e.target.value})}>
            <option value="all">All Collectors</option>
            {uniqueCollected.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>

          <input type="date" value={filter.start} onChange={(e)=>setFilter({...filter, start:e.target.value})} />
          <input type="date" value={filter.end} onChange={(e)=>setFilter({...filter, end:e.target.value})} />
        </div>

        <div className="summary">
          <div className="item"><div className="small muted">Total</div><div>₹ {totals.total.toFixed(2)}</div></div>
          <div className="item"><div className="small muted">Advance</div><div>₹ {totals.advance.toFixed(2)}</div></div>
          <div className="item"><div className="small muted">Due</div><div>₹ {totals.due.toFixed(2)}</div></div>
        </div>
      </div>

      <div className="card">
        <h3>All Tests</h3>
        {loading && <div className="muted">loading...</div>}
        {!loading && filtered().length === 0 && <div className="muted">No entries</div>}

        {filtered().map(r => (
          <div key={r.id} className="list-item">
            <div style={{flex:1}}>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <div>
                  <div style={{fontWeight:700}}>{r.patient_name}</div>
                  <div className="muted small">{new Date(r.created_at || r.date || Date.now()).toLocaleString()}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700}}>₹ {Number(r.total||0).toFixed(2)}</div>
                  <div className="muted">Due: ₹ {Number(r.due||0).toFixed(2)}</div>
                </div>
              </div>

              <div style={{marginTop:8}}>
                <div className="muted small">Tests: { (r.tests || r.tests_selected || "").toString() }</div>
                <div className="muted small">Collected by: {r.collected_by}</div>
                <div style={{marginTop:8}}>
                  <span className={`status ${r.delivery_status==="Fully Delivered" ? "full" : (r.delivery_status==="Partial" ? "partial":"not")}`}>{r.delivery_status}</span>
                </div>
              </div>
            </div>

            <div style={{width:120, textAlign:"right"}}>
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                <button className="btn-ghost" onClick={()=>window.location = `/add?id=${r.id}`}>Edit</button>
                <select onChange={(e)=>updateStatus(r.id, e.target.value)} defaultValue={r.delivery_status}>
                  <option value="Not Delivered">Not Delivered</option>
                  <option value="Partial">Partial</option>
                  <option value="Fully Delivered">Fully Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
