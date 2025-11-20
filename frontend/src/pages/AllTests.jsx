import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllTests() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => load(), []);

  async function load() {
    try {
      const res = await fetch(`https://blood-test-app.onrender.com/all_tests?q=${q}`);
      const data = await res.json();
      setList(data);
    } catch (e) {
      console.error(e);
      alert("Error loading");
    }
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => nav(-1)}>⬅ Back</button>

      <h2>All Tests</h2>

      <input
        placeholder="Search patient"
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyUp={load}
      />

      <div>
        {list.map(r => (
          <div key={r.id} className="card">
            <h3>{r.patient_name}</h3>
            <p>{r.tests.map(t => t.name).join(", ")}</p>
            <p>Total: ₹{r.total}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
