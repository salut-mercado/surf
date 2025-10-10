import axios from "axios";

export const apiAxios = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "Content-Type": "application/json",
  },
  // withCredentials: true, //
});
