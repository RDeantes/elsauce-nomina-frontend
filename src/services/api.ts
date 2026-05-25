import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  // ... si tienes otras configuraciones aquí adentro, déjalas igual
});