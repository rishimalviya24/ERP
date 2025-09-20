// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Public routes (auth) + public GET routes
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicAuthRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    const isPublicGetRoute =
      config.method === "get" &&
      (config.url.startsWith("/courses") || config.url.startsWith("/batches"));

    // Only attach token if NOT a public route
    if (token && !isPublicAuthRoute && !isPublicGetRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
