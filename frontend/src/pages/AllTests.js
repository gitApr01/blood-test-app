import React, { useEffect, useState } from "react";

function AllTests() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTests = async () => {
    const res = await fetch("http://localhost:5000/all_tests");
    const data = await res.json();
    setTests(data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/update_status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    fetchTests();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>All Tests</h2>

      <input
        placeholder="Search by patient name..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {tests
        .filter(t =>
          t.patient_name.toLowerCase().includes(search.toLowerCase())
        )
        .map(test => (
          <div key={test.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <b>Patient:</b> {test.patient_name} ({test.age}/{test.sex}) <br />
            <b>Tests:</b> {test.tests.join(", ")} <br />
            <b>Total:</b> {test.total} | <b>Advance:</b> {test.advance} | <b>Due:</b> {test.due} <br />
            <b>Collected By:</b> {test.collected_by} <br />
            <b>Test By:</b> {test.test_by} <br />
            <b>Status:</b> {test.delivery_status} <br />

            <button onClick={() => updateStatus(test.id, "Fully Delivered")}>Fully Delivered</button>
            <button onClick={() => updateStatus(test.id, "Partial")}>Partial</button>
            <button onClick={() => updateStatus(test.id, "Not Delivered")}>Not Delivered</button>
          </div>
        ))}
    </div>
  );
}

export default AllTests;
