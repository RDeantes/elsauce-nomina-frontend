import axios from "axios";

export const api = axios.create({
  baseURL: "https://elsauce-nomina-backend-production.up.railway.app", // <-- Tu backend real de Railway
});