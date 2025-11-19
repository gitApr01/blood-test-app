// frontend/src/api.js
const BASE = "https://blood-test-app.onrender.com";

const apiFetch = (url, opts = {}) => {
  return fetch(BASE + url, {
    credentials: "include",
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  }).then(async (r) => {
    const text = await r.text();
    try { return JSON.parse(text); } catch { return text; }
  });
};

const API = {
  login: (u,p) => apiFetch("/login", { method: "POST", body: JSON.stringify({ username: u, password: p }) }),
  logout: () => apiFetch("/logout", { method: "POST" }),
  me: () => apiFetch("/me"),
  getCatalog: () => apiFetch("/tests_catalog"),
  getUsers: () => apiFetch("/users"),
  addTest: (data) => apiFetch("/add_test", { method: "POST", body: JSON.stringify(data) }),
  getReports: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch("/all_tests" + (qs ? "?" + qs : ""));
  },
  updateStatus: (id, status) => apiFetch(`/update_status/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  updateCommission: (id, commission_paid) => apiFetch(`/update_commission/${id}`, { method: "PUT", body: JSON.stringify({ commission_paid }) }),
  saveCatalog: (payload) => apiFetch("/tests_catalog", { method: "POST", body: JSON.stringify(payload) })
};

export default API;
