// frontend/src/pages/Reports.js
import React, { useState, useEffect } from "react";
import API from "../api";

export default function Reports() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(()=>{ fetchUsers(); load(); }, []);

  const fetchUsers = async () => {
    const res = await API.getUsers();
    setUsers(Array.isArray(res) ? res : []);
  };

  const load = async () => {
    const data = await API.getReports();
    const filtered = (Array.isArray(data) ? data : []).filter(r => r.created_at && r.created_at.slice(0,7) === month);
    const map = {};
    filtered.forEach(r=>{
      const key = r.collected_by || "unknown";
      if(!map[key]) map[key] = { collected_by: key, total:0, commission_due:0, commission_paid:0, items:[] };
      map[key].total += r.total || 0;
      map[key].commission_due += r.commission_due || 0;
      map[key].commission_paid += r.commission_paid || 0;
      map[key].items.push(r);
    });
    setGroups(Object.values(map));
  };

  return (
    <div>
      <div className="card" style={{padding:12}}>
        <h3>Monthwise Collections</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
          <button className="btn" onClick={load}>Load</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        {groups.map(g => (
          <div key={g.collected_by} className="card" style={{marginBottom:10,padding:12}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700}}>{users.find(u=>String(u.id)===String(g.collected_by))?.username || "Unknown"}</div>
                <div style={{color:'#666'}}>Entries: {g.items.length}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div>Total: <strong>₹{g.total.toFixed(2)}</strong></div>
                <div>Commission Due: <strong>₹{g.commission_due.toFixed(2)}</strong></div>
                <div>Commission Paid: <strong>₹{g.commission_paid.toFixed(2)}</strong></div>
              </div>
            </div>
          </div>
        ))}

        {groups.length === 0 && <div className="empty">No data for this month</div>}
      </div>
    </div>
  );
          }
