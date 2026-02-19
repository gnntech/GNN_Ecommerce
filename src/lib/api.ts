import axios from "axios";

const api = axios.create({
  baseURL: "https://gnn-ecommerce-1.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
