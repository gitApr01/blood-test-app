const API_BASE = "https://blood-test-app.onrender.com" // <-- production backend

export async function post(path, body){
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  })
  return res
}

export async function get(path){
  const res = await fetch(API_BASE + path);
  return res
}
