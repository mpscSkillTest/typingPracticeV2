import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HashParams } from "../types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function getHashParams() {
  // this added to handle access token provided by supabase
  const hash = window.location.hash.substring(1); // Remove the leading '#'
  const params = new URLSearchParams(hash);
  const paramsObject: HashParams = {};
  for (const [key, value] of params) {
    paramsObject[key] = value;
  }

  return paramsObject;
}

export const getCookie = (cookieName: string) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  return cookieValue ? cookieValue.split("=")[1] : "";
};

export function getCookieHandlers(cookieName: string) {
  let cookie = getCookie(cookieName);

  const setCookieValue = (value: string) => {
    // cookie will be expired after 64 mins
    const cookieExpiration = new Date(
      new Date().getTime() + 60 * 24 * 60 * 1000
    );
    document.cookie = `${cookieName}=${value}; expires=${cookieExpiration.toString()}; path=/`;
    cookie = value;
  };

  const removeCookie = () => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    cookie = "";
  };

  const getUpdatedCookie = () => {
    return cookie;
  };

  return () => {
    return {
      getUpdatedCookie,
      setCookieValue,
      removeCookie,
    };
  };
}

export default getHashParams;
