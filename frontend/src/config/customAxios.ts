import axios from "axios";
import { getCookie } from "../utils/hooks/useCookie";
import { AUTH_TOKEN_KEY } from "../utils/constant";

const BASE_URL = "http://localhost:5000/api";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Retrieve the access token from the cookie
    const accessToken = getCookie(AUTH_TOKEN_KEY);
    // Add the access token to the request headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
