export const API = "https://blood-test-app.onrender.com";

export async function apiGet(path){
  const res = await fetch(API + path);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body){
  const res = await fetch(API + path, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut(path, body){
  const res = await fetch(API + path, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
