import axios from "axios";

const api = axios.create({
  baseURL: "https://blood-test-backend.onrender.com", // your backend
});

export default api;
