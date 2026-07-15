import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("relieflink_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("relieflink_token");
      localStorage.removeItem("relieflink_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const rootApi = axios.create({
  baseURL: API_ROOT,
  headers: { "Content-Type": "application/json" }
});

export default api;
