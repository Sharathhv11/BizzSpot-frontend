import axios from "axios";



const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000*60*2,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url.includes("/auth/sign-up")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
       window.location.href = "/login";

    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
