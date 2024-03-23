import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_TOKEN_KEY, SUPABASE_AUTH_URL_KEY } from "../utils/constant";
import axios from "../config/customAxios";
import useHashParams from "../utils/hooks/useHashParams";
import useCookie from "../utils/hooks/useCookie";

type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;
  const hashParams = useHashParams();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isValidUser, setIsValidUser] = useState<boolean>(false);
  const accessTokenFromURL = hashParams[SUPABASE_AUTH_URL_KEY] || "";
  const { cookie: accessToken, setCookieValue: setAccessToken } =
    useCookie(AUTH_TOKEN_KEY);
  const hasAccessTokenVerified = useRef<boolean>(false);

  const verifyUser = async () => {
    try {
      const response = await axios.post("/authorize/verify/");
      const { data } = response || {};
      const { user, error } = data || {};
      if (user) {
        setIsValidUser(true);
      } else if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
      setIsValidUser(false);
    }
  };

  const waitForVerification = async () => {
    await verifyUser();
    setShowLoader(false);
  };

  useEffect(() => {
    if (accessTokenFromURL && typeof setAccessToken === "function") {
      setAccessToken(accessTokenFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasAccessTokenVerified.current && typeof accessToken === "string") {
      hasAccessTokenVerified.current = true;
      waitForVerification();
    }
  }, [accessToken]);

  if (showLoader) {
    return <div>Loader</div>;
  }

  return isValidUser ? children : <Navigate to={"/signin"} replace />;
};

export default ProtectedRoute;
