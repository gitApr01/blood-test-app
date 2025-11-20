import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllTests() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  async function load() {
    const res = await fetch("https://blood-test-app.onrender.com/all_tests");
    const data = await res.json();
    setRows(data);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <h2>All Tests</h2>

      {rows.map(r => (
        <div key={r.id} className="card" onClick={() => navigate(`/edit/${r.id}`)}>
          <h3>{r.patient_name}</h3>
          <p>{r.sex}, {r.age} yrs</p>

          <p><b>Tests:</b> {r.tests.map(t => t.name).join(", ")}</p>
          <p><b>Total:</b> ₹{r.total} | <b>Due:</b> ₹{r.due}</p>

          <p>Lab: {r.test_by}</p>
          <p>Status: {r.delivery_status}</p>

          <small>{r.created_at.slice(0, 10)}</small>
        </div>
      ))}
    </div>
  );
}
