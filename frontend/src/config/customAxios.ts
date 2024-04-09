import axios from "axios";
import { getCookie } from "../utils/utils";
import { AUTH_TOKEN_KEY } from "../utils/constant";

const BASE_URL = "http://localhost:5000/api";

/***
 * TODO: this was causing issue for wifi connection due to region mismatch between
 * db hosting and application hosting
 */
/* const PROD_BASE_URL_SINGAPORE_VERSION =
  "https://typingpracticev2.onrender.com/api"; */

/**
 * Deployed on US-west region
 */
const PROD_BASE_URL = "https://typingpracticev2-v5n2.onrender.com/api";

const isLocalEnv = process.env.NODE_ENV === "development";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: isLocalEnv ? BASE_URL : PROD_BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Retrieve the access token from the cookie
    const accessToken = getCookie(AUTH_TOKEN_KEY);
    // Add the access token to the request headers
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
