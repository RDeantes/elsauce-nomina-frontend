import axios from "axios";

export const api = axios.create({
  // Borra el process.env temporalmente y pega la URL pública de tu backend de Railway
  baseURL: "https://elsauce-nomina-backend-production.up.railway.app/", 
});