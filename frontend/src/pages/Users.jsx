import React, { useEffect, useState } from "react";
import { API } from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await API("/users");
    setUsers(data);
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => history.back()}>
        ← Back
      </button>

      <h2>Users</h2>

      <div className="list">
        {users.map(u => (
          <div className="card list-item" key={u.id}>
            {u.username} — {u.role}
          </div>
        ))}
      </div>
    </div>
  );
}
