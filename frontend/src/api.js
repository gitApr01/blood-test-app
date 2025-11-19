import axios from "axios";

const BASE_URL = "https://blood-test-app.onrender.com"; 
// <-- If your backend uses a different domain (render/netlify), replace above.

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export default api;
