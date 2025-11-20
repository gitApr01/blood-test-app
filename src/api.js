export const API_BASE = 'https://blood-test-app.onrender.com'
export async function apiFetch(path, opts){
  const url = API_BASE + path
  const res = await fetch(url, opts)
  if(!res.ok){
    const t = await res.text().catch(()=>null)
    throw new Error('API error: ' + (t || res.status))
  }
  return res.json().catch(()=>null)
}
