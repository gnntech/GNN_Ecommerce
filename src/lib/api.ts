import axios from "axios";

const api = axios.create({
  baseURL: "https://gnn-ecommerce-1.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const storedUser = sessionStorage.getItem("adminUser");
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("adminUser");
      window.location.href = "/admin"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
