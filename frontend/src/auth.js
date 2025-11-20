const STORAGE_KEY = 'bloodtest_user'
export function saveUser(user){ localStorage.setItem(STORAGE_KEY, JSON.stringify(user)) }
export function getUser(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) }catch(e){ return null } }
export function logout(){ localStorage.removeItem(STORAGE_KEY) }
