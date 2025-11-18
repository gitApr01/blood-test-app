import React, { useState } from "react";

const TEST_LIST = [
  "TC", "DC", "ESR", "Hb%",
  "BSR", "BSF", "BSPP",
  "LFT", "LIPID PROFILE", "UREA",
  "CREATININE", "CALCIUM", "FSH",
  "RA FACTOR", "CRP", "ASO"
];

function AddTest() {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    sex: "M",
  });

  const [selectedTests, setSelectedTests] = useState([]);
  const [otherTest, setOtherTest] = useState("");

  const [billing, setBilling] = useState({
    total: 0,
    advance: 0,
    due: 0,
    paid_to: "",
    collected_by: "",
    test_by: ""
  });

  const toggleTest = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const submitForm = async () => {
    const tests_to_send = [...selectedTests];
    if (otherTest.trim() !== "") tests_to_send.push(otherTest);

    const res = await fetch("https://YOUR-BACKEND.onrender.com/add_test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_name: patient.name,
        age: patient.age,
        sex: patient.sex,
        tests: tests_to_send,
        total: billing.total,
        advance: billing.advance,
        due: billing.due,
        paid_to: billing.paid_to,
        collected_by: billing.collected_by,
        test_by: billing.test_by
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Test saved!");
    } else {
      alert("Error saving test!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Test</h2>

      <h3>Patient Info</h3>
      <input placeholder="Name" onChange={e => setPatient({ ...patient, name: e.target.value })} /><br /><br />
      <input placeholder="Age" onChange={e => setPatient({ ...patient, age: e.target.value })} /><br /><br />
      <select onChange={e => setPatient({ ...patient, sex: e.target.value })}>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>

      <h3>Tests</h3>

      {TEST_LIST.map(test => (
        <div key={test}>
          <input
            type="checkbox"
            checked={selectedTests.includes(test)}
            onChange={() => toggleTest(test)}
          />
          {test}
        </div>
      ))}

      <br />
      <input
        placeholder="Other Test"
        onChange={(e) => setOtherTest(e.target.value)}
      />

      <h3>Billing</h3>
      <input
        placeholder="Total"
        type="number"
        onChange={e => setBilling({ ...billing, total: e.target.value })}
      /><br /><br />

      <input
        placeholder="Advance"
        type="number"
        onChange={e => setBilling({ ...billing, advance: e.target.value })}
      /><br /><br />

      <input
        placeholder="Due"
        type="number"
        value={billing.total - billing.advance}
        readOnly
      /><br /><br />

      <input placeholder="Paid To" onChange={e => setBilling({ ...billing, paid_to: e.target.value })} /><br /><br />
      <input placeholder="Collected By" onChange={e => setBilling({ ...billing, collected_by: e.target.value })} /><br /><br />
      <input placeholder="Test By" onChange={e => setBilling({ ...billing, test_by: e.target.value })} /><br /><br />

      <button onClick={submitForm}>Save</button>
    </div>
  );
}

export default AddTest;
