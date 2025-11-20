export function saveUser(user){ localStorage.setItem('bt_user', JSON.stringify(user)) }
export function getUser(){ try{ return JSON.parse(localStorage.getItem('bt_user')) }catch(e){ return null } }
export function logout(){ localStorage.removeItem('bt_user') }
