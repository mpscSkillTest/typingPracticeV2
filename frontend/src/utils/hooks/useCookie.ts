import { useState } from "react";

const DEFAULT_EXPIRATION_DAYS = 5;

export const getCookie = (cookieName: string) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  return cookieValue ? cookieValue.split("=")[1] : "";
};

function useCookie(cookieName: string) {
  const [cookie, setCookie] = useState<string>(getCookie(cookieName));

  const setCookieValue = (value: string) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + DEFAULT_EXPIRATION_DAYS);
    document.cookie = `${cookieName}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    setCookie(value);
  };

  const removeCookie = () => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setCookie("");
  };

  return [cookie, setCookieValue, removeCookie];
}

export default useCookie;
