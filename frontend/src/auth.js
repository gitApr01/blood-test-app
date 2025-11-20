export function saveUser(user){ localStorage.setItem("bt_user", JSON.stringify(user)); }
export function getUser(){ try { return JSON.parse(localStorage.getItem("bt_user")); } catch { return null; } }
export function logoutUser(){ localStorage.removeItem("bt_user"); window.location = "/"; }
