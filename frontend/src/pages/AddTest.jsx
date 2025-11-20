import React, { useState, useEffect } from "react";
import { API } from "../api";

export default function AddTest() {
  const [catalog, setCatalog] = useState([]);
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    sex: "M",
    advance: 0,
    collected_by: 1,
    test_by: "",
    date: "",
    created_by: 1,
    paid_to: ""
  });

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    const data = await API("/tests_catalog");
    setCatalog(data);
  }

  function toggleTest(t) {
    const exists = selected.find(x => x.id === t.id);
    if (exists) {
      setSelected(selected.filter(x => x.id !== t.id));
    } else {
      setSelected([...selected, t]);
    }
  }

  async function submit() {
    if (!patient.name) return alert("Enter patient name");
    if (selected.length === 0) return alert("Select tests");

    const body = {
      patient_name: patient.name,
      age: patient.age,
      sex: patient.sex,
      date: patient.date,
      tests: selected.map(t => ({ name: t.name, price: t.price })),
      advance: patient.advance,
      collected_by: patient.collected_by,
      created_by: patient.created_by,
      test_by: patient.test_by,
      paid_to: patient.paid_to
    };

    const res = await API("/add_test", "POST", body);

    if (res.success) {
      alert("Saved");
      setSelected([]);
      setPatient({ ...patient, name: "", age: "", advance: 0 });
    }
  }

  return (
    <div className="container">
      <h2>Add Test</h2>

      <div className="card">
        <label>Patient Name</label>
        <input
          value={patient.name}
          onChange={e => setPatient({ ...patient, name: e.target.value })}
        />

        <label>Age</label>
        <input
          value={patient.age}
          onChange={e => setPatient({ ...patient, age: e.target.value })}
        />

        <label>Sex</label>
        <select
          value={patient.sex}
          onChange={e => setPatient({ ...patient, sex: e.target.value })}
        >
          <option>M</option>
          <option>F</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={patient.date}
          onChange={e => setPatient({ ...patient, date: e.target.value })}
        />

        <label>Advance</label>
        <input
          value={patient.advance}
          onChange={e => setPatient({ ...patient, advance: e.target.value })}
        />

        <label>Paid To</label>
        <input
          value={patient.paid_to}
          onChange={e => setPatient({ ...patient, paid_to: e.target.value })}
        />

        <label>Test By</label>
        <input
          value={patient.test_by}
          onChange={e => setPatient({ ...patient, test_by: e.target.value })}
        />
      </div>

      <h3>Select Tests</h3>
      <div className="list">
        {catalog.map(t => (
          <div
            key={t.id}
            className={
              selected.some(s => s.id === t.id)
                ? "list-item selected"
                : "list-item"
            }
            onClick={() => toggleTest(t)}
          >
            {t.name} — ₹{t.price}
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={submit}>
        Save
      </button>
    </div>
  );
}
