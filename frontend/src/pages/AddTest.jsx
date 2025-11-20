import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTest() {
  const nav = useNavigate();

  const [catalog, setCatalog] = useState([]);
  const [tests, setTests] = useState([]);
  const [patient_name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Male");
  const [advance, setAdvance] = useState(0);
  const [test_by, setTestBy] = useState("");
  const [paid_to, setPaidTo] = useState("");
  const [collected_by, setCollectedBy] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    try {
      const res = await fetch("https://blood-test-app.onrender.com/tests_catalog");
      const data = await res.json();
      setCatalog(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load catalog");
    }
  }

  function toggleTest(t) {
    const exists = tests.find(x => x.id === t.id);
    if (exists) {
      setTests(tests.filter(x => x.id !== t.id));
    } else {
      setTests([...tests, t]);
    }
  }

  async function save() {
    if (!patient_name || !age || tests.length === 0) {
      alert("Enter all required fields");
      return;
    }

    try {
      const res = await fetch("https://blood-test-app.onrender.com/add_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name,
          age,
          sex,
          tests,
          advance,
          test_by,
          paid_to,
          collected_by,
          date
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Added");
        nav("/tests");
      } else {
        alert("Failed");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    }
  }

  const total = tests.reduce((s, t) => s + Number(t.price), 0);
  const due = total - Number(advance);

  return (
    <div className="container">

      <button className="btn-back" onClick={() => nav(-1)}>⬅ Back</button>

      <h2>Add Test</h2>

      <label>Patient Name</label>
      <input value={patient_name} onChange={e => setName(e.target.value)} />

      <label>Age</label>
      <input value={age} onChange={e => setAge(e.target.value)} type="number" />

      <label>Sex</label>
      <select value={sex} onChange={e => setSex(e.target.value)}>
        <option>Male</option>
        <option>Female</option>
      </select>

      <label>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <h3>Select Tests</h3>
      <div className="card">
        {catalog.map(t => (
          <div key={t.id} className="list-item"
            onClick={() => toggleTest(t)}
            style={{
              background: tests.find(x => x.id === t.id) ? "#d1f0ff" : "white"
            }}>
            {t.name} — ₹{t.price}
          </div>
        ))}
      </div>

      <h3>Payment Details</h3>

      <label>Advance</label>
      <input type="number" value={advance} onChange={e => setAdvance(e.target.value)} />

      <label>Collected By</label>
      <input value={collected_by} onChange={e => setCollectedBy(e.target.value)} />

      <label>Test By</label>
      <input value={test_by} onChange={e => setTestBy(e.target.value)} />

      <label>Paid To</label>
      <input value={paid_to} onChange={e => setPaidTo(e.target.value)} />

      <div className="summary">
        <p>Total: <b>₹{total}</b></p>
        <p>Due: <b>₹{due}</b></p>
      </div>

      <button className="btn-primary" onClick={save}>Save</button>

    </div>
  );
}
