import React, { useState, useEffect } from "react";
import api from "./api";

export default function App() {
  const [tests, setTests] = useState([]);
  const [patient, setPatient] = useState("");
  const [testName, setTestName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests() {
    const res = await api.get("/tests");
    setTests(res.data);
  }

  async function addTest() {
    if (!patient || !testName || !value) {
      alert("Fill all fields");
      return;
    }

    await api.post("/tests", {
      patient,
      testName,
      value,
      date: date || new Date().toISOString().substring(0, 10)
    });

    setPatient("");
    setTestName("");
    setValue("");
    setDate("");
    loadTests();
  }

  return (
    <div>
      <div className="top-bar">Blood Test Reports</div>

      <div className="container">

        <h2>Add Test</h2>

        <input
          placeholder="Patient Name"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
        />

        <input
          placeholder="Test Name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />

        <input
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={addTest}>Add Test</button>

        <h2>All Reports</h2>

        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Value</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.patient}</td>
                <td>{t.testName}</td>
                <td>{t.value}</td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
