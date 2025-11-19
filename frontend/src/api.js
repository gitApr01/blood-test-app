// frontend/src/api.js
const BASE = "https://blood-test-app.onrender.com";

async function apiFetch(path, opts = {}) {
  const res = await fetch(BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export default {
  login: (username, password) => apiFetch("/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => apiFetch("/logout", { method: "POST" }),
  getCatalog: () => apiFetch("/tests_catalog"),
  saveCatalog: (payload) => apiFetch("/tests_catalog", { method: "POST", body: JSON.stringify(payload) }),
  getUsers: () => apiFetch("/users"),
  addTest: (payload) => apiFetch("/add_test", { method: "POST", body: JSON.stringify(payload) }),
  getReports: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch("/all_tests" + (qs ? `?${qs}` : ""));
  },
  updateStatus: (id, status) => apiFetch(`/update_status/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  updateCommission: (id, commission_paid) => apiFetch(`/update_commission/${id}`, { method: "PUT", body: JSON.stringify({ commission_paid }) }),
};
