export const BASE = "https://blood-test-app.onrender.com"

export async function post(path, body){ const res = await fetch(BASE + path, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if(!res.ok) throw new Error(await res.text()); return res.json(); }

export async function get(path){ const res = await fetch(BASE + path); if(!res.ok) throw new Error(await res.text()); return res.json(); }

export async function put(path, body){ const res = await fetch(BASE + path, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if(!res.ok) throw new Error(await res.text()); return res.json(); }
