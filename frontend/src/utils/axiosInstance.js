// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Interceptor – attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Public routes (auth only)
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicAuthRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached:", token);
    } else {
      console.warn("⚠️ No token attached for:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
