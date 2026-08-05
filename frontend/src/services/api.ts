import axios from "axios";

const SESSION_EXPIRED_EVENT =
  "clone-trello:session-expired";

let isHandlingSessionExpiration = false;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    "@clone-trello:token",
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const requestUrl = error.config?.url ?? "";

      const isLoginRequest = 
        requestUrl.includes("/auth/login");

      if (
        !isLoginRequest &&
        !isHandlingSessionExpiration
      ) {
        isHandlingSessionExpiration = true;

        localStorage.removeItem(
          "@clone-trello:token",
        );

        localStorage.removeItem(
          "@clone-trello:user",
        );

        window.dispatchEvent(
          new Event(SESSION_EXPIRED_EVENT),
        );

        window.setTimeout(() => {
          isHandlingSessionExpiration = false;
        }, 100);
      }
    }

    return Promise.reject(error);
  },
);

export { SESSION_EXPIRED_EVENT };