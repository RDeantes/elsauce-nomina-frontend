import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URl,
  // ... si tienes otras configuraciones a

});