import axios from "axios";

export const apiBaseService = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
})