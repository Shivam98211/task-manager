import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://task-manager-production-7528.up.railway.app/api",
});

export default API;
