import axios from "axios";

export const api = axios.create({
  baseURL: "https://task-manger-backend-3.onrender.com/api",
});
