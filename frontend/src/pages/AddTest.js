// frontend/src/pages/AddTest.js
import React, { useEffect, useState } from "react";
import API from "../api";

export default function AddTest({ user }) {
  const today = new Date().toISOString().slice(0, 10);
  const [patient, setPatient] = useState({ name: "", age: "", sex: "M" });
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState([]);
  const [otherName, setOtherName] = useState("");
  const [otherPrice, setOtherPrice] = useState("");
  const [advance, setAdvance] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [testBy, setTestBy] = useState("");
  const [date, setDate] = useState(today);
  const [collectedBy, setCollectedBy] = useState(localStorage.getItem("userid") || "");

  useEffect(() => { fetchCatalog(); }, []);

  const fetchCatalog = async () => {
    const res = await API.getCatalog();
    if (Array.isArray(res)) setCatalog(res);
  };

  const toggle = (item) => {
    const exists = selected.find(s => s.name === item.name);
    if (exists) setSelected(selected.filter(s => s.name !== item.name));
    else setSelected([...selected, item]);
  };

  const sumTotal = () => {
    const s = selected.reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0);
    const other = parseFloat(otherPrice || 0);
    return +(s + (isNaN(other) ? 0 : other)).toFixed(2);
  };

  const submit = async () => {
    if (!patient.name) return alert("Enter patient name");
    const testsToSend = selected.map(t => ({ name: t.name, price: t.price }));
    if (otherName) testsToSend.push({ name: otherName, price: parseFloat(otherPrice || 0) || 0 });

    const payload = {
      patient_name: patient.name,
      age: patient.age,
      sex: patient.sex,
      tests: testsToSend,
      advance: parseFloat(advance || 0),
      paid_to: paidTo,
      collected_by: collectedBy ? parseInt(collectedBy) : null,
      test_by: testBy,
      created_by: collectedBy ? parseInt(collectedBy) : null,
      date: date
    };

    const res = await API.addTest(payload);
    if (res && res.success) {
      alert("Test saved");
      window.location = "/tests";
    } else {
      alert("Failed to save");
    }
  };

  return (
    <div className="card add-card">
      <div className="add-header"><h3>Add Patient Test</h3></div>

      <div className="form-grid">
        <div>
          <label>Patient Name</label>
          <input className="input" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
        </div>
        <div>
          <label>Age</label>
          <input className="input" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
        </div>
        <div>
          <label>Sex</label>
          <select className="input" value={patient.sex} onChange={(e) => setPatient({ ...patient, sex: e.target.value })}>
            <option value="M">M</option><option value="F">F</option>
          </select>
        </div>
        <div>
          <label>Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <h4>Choose tests (tap to toggle)</h4>
      <div className="catalog-grid">
        {catalog.map(c => (
          <div key={c.id} className={`catalog-item ${selected.find(s => s.name === c.name) ? "selected" : ""}`} onClick={() => toggle(c)}>
            <div className="catalog-name">{c.name}</div>
            <div className="catalog-price">₹{c.price}</div>
          </div>
        ))}
      </div>

      <div className="other-row">
        <input className="input" placeholder="Other test name" value={otherName} onChange={(e) => setOtherName(e.target.value)} />
        <input className="input" placeholder="Price" value={otherPrice} onChange={(e) => setOtherPrice(e.target.value)} />
      </div>

      <h4>Billing</h4>
      <div className="billing-row">
        <div>Total: <strong>₹{sumTotal().toFixed(2)}</strong></div>
        <div>Advance: <input className="input small" type="number" value={advance} onChange={(e) => setAdvance(e.target.value)} /></div>
      </div>

      <div className="form-grid">
        <div>
          <label>Paid To</label>
          <input className="input" value={paidTo} onChange={(e) => setPaidTo(e.target.value)} />
        </div>
        <div>
          <label>Test By (Lab)</label>
          <input className="input" value={testBy} onChange={(e) => setTestBy(e.target.value)} />
        </div>
        <div>
          <label>Collected By (user id)</label>
          <input className="input" value={collectedBy} onChange={(e) => setCollectedBy(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={() => (window.location = "/tests")}>Cancel</button>
        <button className="btn primary" onClick={submit}>Save</button>
      </div>
    </div>
  );
}
