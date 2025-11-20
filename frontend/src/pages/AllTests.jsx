import React, { useEffect, useState } from "react";
import { API } from "../api";

export default function AllTests() {
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await API("/all_tests");
    setList(data);
  }

  const filtered = list.filter(r =>
    r.patient_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <button className="btn-back" onClick={() => history.back()}>
        ← Back
      </button>

      <h2>All Tests</h2>

      <input
        placeholder="Search by name"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="list">
        {filtered.map(r => (
          <div key={r.id} className="card list-item">
            <b>{r.patient_name}</b> ({r.age}/{r.sex})
            <br />
            <small>{r.tests.length} tests — ₹{r.total}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
