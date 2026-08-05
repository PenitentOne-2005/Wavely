import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      Cookies.remove("token");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    } else if (status >= 500) {
      console.error(
        "Ошибка сервера (5xx):",
        error.response?.data || error.message,
      );
    } else if (!error.response) {
      console.error("Сетевая ошибка или сервер недоступен");
    }

    return Promise.reject(error);
  },
);

export default api;
