import axios from "axios";
import { getCookie } from "../utils/utils";
import { AUTH_TOKEN_KEY } from "../utils/constant";

const customEnv = import.meta.env.VITE_CUSTOM_ENV;

const BASE_URL = "http://localhost:5001/api";

/**
 * Deployed on US-west region
 */
const PROD_BASE_URL = "https://typingpracticev2-v5n2.onrender.com/api";

const DEV_BASE_URL = "https://dev-typing-practice-api.onrender.com/api";

const STAGING_BASE_URL = "https://staging-ezpp.onrender.com/api";

let baseURL = "";

switch (customEnv) {
  case "development":
    baseURL = DEV_BASE_URL;
    break;
  case "staging":
    baseURL = STAGING_BASE_URL;
    break;
  case "production":
    baseURL = PROD_BASE_URL;
    break;
  default:
    baseURL = BASE_URL;
    break;
}

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL,
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
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
