import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth";

export default function AddTest() {
  const navigate = useNavigate();
  const user = getUser();

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Male");
  const [testList, setTestList] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [advance, setAdvance] = useState(0);
  const [testBy, setTestBy] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    async function load() {
      const res = await fetch("https://blood-test-app.onrender.com/tests_catalog");
      const data = await res.json();
      setTestList(data);
    }
    load();
  }, []);

  function toggleTest(test) {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  }

  const total = selectedTests.reduce((sum, t) => sum + Number(t.price), 0);
  const due = total - Number(advance || 0);

  async function saveTest() {
    if (!patientName) return alert("Enter patient name");
    if (selectedTests.length === 0) return alert("Select at least 1 test");

    const payload = {
      patient_name: patientName,
      age,
      sex,
      tests: selectedTests.map(t => ({
        id: t.id,
        name: t.name,
        price: t.price
      })),
      advance: Number(advance || 0),
      paid_to: user.username,
      collected_by: user.id,
      created_by: user.id,
      test_by: testBy,
      date
    };

    const res = await fetch("https://blood-test-app.onrender.com/add_test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      alert("Test Added Successfully");
      navigate("/tests");
    } else {
      alert("Error saving test");
    }
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <h2>Add New Test</h2>

      <label>Patient Name</label>
      <input value={patientName} onChange={e => setPatientName(e.target.value)} />

      <label>Age</label>
      <input type="number" value={age} onChange={e => setAge(e.target.value)} />

      <label>Sex</label>
      <select value={sex} onChange={e => setSex(e.target.value)}>
        <option>Male</option>
        <option>Female</option>
      </select>

      <label>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <h3>Select Tests</h3>
      <div className="card" style={{ maxHeight: 200, overflowY: "auto" }}>
        {testList.map(t => (
          <div key={t.id} className="test-item">
            <input
              type="checkbox"
              checked={selectedTests.some(s => s.id === t.id)}
              onChange={() => toggleTest(t)}
            />
            {t.name} — ₹{t.price}
          </div>
        ))}
      </div>

      <label>Advance</label>
      <input type="number" value={advance} onChange={e => setAdvance(e.target.value)} />

      <label>Test By / Lab</label>
      <input value={testBy} onChange={e => setTestBy(e.target.value)} />

      <div className="summary-box">
        <p>Total: ₹{total}</p>
        <p>Due: ₹{due}</p>
      </div>

      <button className="btn-primary" onClick={saveTest}>Save</button>
    </div>
  );
}
