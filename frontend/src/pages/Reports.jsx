import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => load(), []);

  async function load() {
    try {
      const res = await fetch("https://blood-test-app.onrender.com/all_tests");
      const data = await res.json();
      setRows(data);
    } catch (e) {}
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => nav(-1)}>⬅ Back</button>

      <h2>Reports</h2>

      {rows.map(r => (
        <div key={r.id} className="card">
          <h3>{r.patient_name}</h3>
          <p>Tests: {r.tests.map(t => t.name).join(", ")}</p>
          <p>Due: ₹{r.due}</p>
        </div>
      ))}
    </div>
  );
}
