import axios from "axios";

// 🔹 Usa la variable de entorno si existe, o localhost como respaldo
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// 🔹 Interceptor para agregar token automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

