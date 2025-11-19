import React, { useEffect, useState } from "react";
import api from "../api";

export default function Reports({ user }) {
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState( new Date().toISOString().slice(0,7) ); // YYYY-MM
  const [summary, setSummary] = useState([]);

  useEffect(()=>{ load(); }, [month]);

  async function load(){
    try {
      const res = await api.get("/all_tests");
      const all = res.data || [];
      // filter by month
      const filtered = all.filter(r => (r.created_at||r.date||"").slice(0,7) === month);
      setReports(filtered);
      calc(filtered);
    } catch(e){ console.error(e); alert("Failed to load"); }
  }

  function calc(list){
    // grouped by collected_by
    const map = {};
    list.forEach(r=>{
      const c = r.collected_by || "Unknown";
      if (!map[c]) map[c] = { collectedBy:c, total:0, adminShare:0, commissionPaid:0, commissionDue:0, entries:[] };
      map[c].total += Number(r.total||0);
      const adminShare = Number((0.4 * Number(r.total||0)).toFixed(2));
      map[c].adminShare += adminShare;
      // commissionPaid stored? backend doesn't have field. We'll assume admin enters paid value using UI and we store locally (could be extended to backend)
      map[c].entries.push(r);
    });
    const arr = Object.values(map);
    arr.forEach(a => { a.commissionPaid = 0; a.commissionDue = a.adminShare - a.commissionPaid; });
    setSummary(arr);
  }

  // In a production app you'd persist commissionPaid to backend -
  // Here we allow admin to put commission received per collector and compute commissionDue.
  function setPaid(idx, val){
    const arr = [...summary];
    arr[idx].commissionPaid = Number(val || 0);
    arr[idx].commissionDue = Number((arr[idx].adminShare - arr[idx].commissionPaid).toFixed(2));
    setSummary(arr);
  }

  return (
    <div>
      <div className="card">
        <h2>Monthly Report</h2>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <input type="month" value={month} onChange={(e)=>setMonth(e.target.value)} />
          <button className="btn-ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="card">
        <h3>Summary (Collected By)</h3>
        {summary.length===0 && <div className="muted">No records</div>}
        {summary.map((s, idx) => (
          <div key={s.collectedBy} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px dashed #eef2f7"}}>
            <div>
              <div style={{fontWeight:700}}>{s.collectedBy}</div>
              <div className="muted small">Total collected: ₹ {s.total.toFixed(2)}</div>
              <div className="muted small">Admin share (40%): ₹ {s.adminShare.toFixed(2)}</div>
            </div>

            <div style={{width:220, display:"flex", gap:8, alignItems:"center"}}>
              <input type="number" value={s.commissionPaid} onChange={(e)=>setPaid(idx, e.target.value)} />
              <div className="small muted">Due: ₹ {s.commissionDue?.toFixed(2) || "0.00"}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Entries ({reports.length})</h3>
        {reports.map(r => (
          <div key={r.id} style={{padding:"8px 0", borderBottom:"1px dashed #eef2f7"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700}}>{r.patient_name}</div>
                <div className="muted small">{r.tests?.toString()}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700}}>₹ {Number(r.total||0).toFixed(2)}</div>
                <div className="muted small">{r.collected_by} • {r.test_by}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
          }
