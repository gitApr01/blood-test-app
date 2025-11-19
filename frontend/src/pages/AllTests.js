// frontend/src/pages/AllTests.js
import React, { useEffect, useState } from "react";
import API from "../api";

function quickRange(option) {
  const now = new Date();
  const start = new Date(now);
  let end = new Date(now);
  if (option === "today") {
    // start/end same
  } else if (option === "week") {
    start.setDate(now.getDate() - now.getDay()); // sunday
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (option === "month") {
    start.setDate(1);
    end = new Date(start.getFullYear(), start.getMonth()+1, 0);
  } else if (option === "year") {
    start.setMonth(0); start.setDate(1);
    end = new Date(start.getFullYear(), 11, 31);
  }
  const pad = d => d.toISOString().slice(0,10);
  return { from: pad(start), to: pad(end) };
}

export default function AllTests({ user }) {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [testBy, setTestBy] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total:0, advance:0, due:0, commission_due:0, commission_paid:0 });

  useEffect(()=>{ load(); fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await API.getUsers();
    if (Array.isArray(res)) setUsers(res);
  };

  const load = async () => {
    const params = {};
    if (q) params.q = q;
    if (status) params.status = status;
    if (testBy) params.test_by = testBy;
    if (collectedBy) params.collected_by = collectedBy;
    if (sort) params.sort = sort;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    const data = await API.getReports(params);
    setRows(Array.isArray(data) ? data : []);
    computeSummary(Array.isArray(data) ? data : []);
  };

  const computeSummary = (list) => {
    const s = { total:0, advance:0, due:0, commission_due:0, commission_paid:0 };
    list.forEach(r => {
      s.total += (r.total || 0);
      s.advance += (r.advance || 0);
      s.due += (r.due || 0);
      s.commission_due += (r.commission_due || 0);
      s.commission_paid += (r.commission_paid || 0);
    });
    setSummary({ total: +s.total.toFixed(2), advance: +s.advance.toFixed(2), due: +s.due.toFixed(2), commission_due: +s.commission_due.toFixed(2), commission_paid: +s.commission_paid.toFixed(2) });
  };

  const applyQuick = (opt) => {
    if (!opt) { setFromDate(""); setToDate(""); load(); return; }
    const r = quickRange(opt);
    setFromDate(r.from);
    setToDate(r.to);
    // call load after state updates (use small timeout)
    setTimeout(() => load(), 50);
  };

  const updateStatus = async (id, st) => {
    await API.updateStatus(id, st);
    load();
  };

  const updateCommission = async (id, value) => {
    await API.updateCommission(id, parseFloat(value || 0));
    load();
  };

  return (
    <div>
      <div className="filters-row card">
        <div className="filters-left">
          <input className="input" placeholder="Search patient" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option>Not Delivered</option><option>Partial</option><option>Fully Delivered</option>
          </select>

          <input className="input" placeholder="Test by (lab)" value={testBy} onChange={e=>setTestBy(e.target.value)} />
          <select className="input" value={collectedBy} onChange={e=>setCollectedBy(e.target.value)}>
            <option value="">All collectors</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>

          <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="name_asc">Name A→Z</option>
            <option value="name_desc">Name Z→A</option>
            <option value="lab_asc">Lab A→Z</option>
          </select>
        </div>

        <div className="filters-right">
          <div className="quick-buttons">
            <button onClick={()=>applyQuick("today")}>Today</button>
            <button onClick={()=>applyQuick("week")}>This Week</button>
            <button onClick={()=>applyQuick("month")}>This Month</button>
            <button onClick={()=>applyQuick("year")}>This Year</button>
            <button onClick={()=>applyQuick("")}>Clear</button>
          </div>

          <div className="date-range">
            <input className="input" type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
            <input className="input" type="date" value={toDate} onChange={e=>setToDate(e.target.value)} />
            <button className="btn" onClick={load}>Filter</button>
          </div>
        </div>
      </div>

      <div className="summary-row card">
        <div>Total: <strong>₹{summary.total.toFixed(2)}</strong></div>
        <div>Advance: <strong>₹{summary.advance.toFixed(2)}</strong></div>
        <div>Due: <strong>₹{summary.due.toFixed(2)}</strong></div>
        <div>Comm Due: <strong>₹{summary.commission_due.toFixed(2)}</strong></div>
        <div>Comm Paid: <strong>₹{summary.commission_paid.toFixed(2)}</strong></div>
      </div>

      <div className="list">
        {rows.map(r => (
          <div key={r.id} className="list-card">
            <div className="card-left">
              <div className="name">{r.patient_name}</div>
              <div className="meta">{new Date(r.created_at).toLocaleDateString()} • INV-{String(r.id).padStart(6,'0')}</div>
              <div className="tests">{r.tests.map(t=>t.name + " (₹"+t.price+")").join(', ')}</div>
              <div className={`status ${r.delivery_status === 'Fully Delivered' ? 'paid' : r.delivery_status === 'Partial' ? 'partial' : 'not'}`}>{r.delivery_status}</div>
            </div>

            <div className="card-right">
              <div className="amount">₹{(r.total||0).toFixed(2)}</div>
              <div className="due">Due: ₹{(r.due||0).toFixed(2)}</div>
              <div className="commission">Comm Due: ₹{(r.commission_due||0).toFixed(2)}</div>

              {user && user.role === 'admin' ? (
                <div style={{marginTop:8}}>
                  <input className="input small" defaultValue={r.commission_paid} onBlur={e=>updateCommission(r.id, e.target.value)} />
                </div>
              ) : null}

              <div style={{marginTop:10,display:'flex',gap:6}}>
                <button className="btn" onClick={()=>updateStatus(r.id,'Fully Delivered')}>Fully</button>
                <button className="btn" onClick={()=>updateStatus(r.id,'Partial')}>Partial</button>
                <button className="btn" onClick={()=>updateStatus(r.id,'Not Delivered')}>Not</button>
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && <div className="empty">No reports found</div>}
      </div>
    </div>
  );
              }
