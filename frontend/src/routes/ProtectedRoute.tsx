import { useEffect, useRef } from "react";
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
  const accessTokenFromURL = hashParams[SUPABASE_AUTH_URL_KEY] || "";
  const [accessToken, setAccessToken] = useCookie(AUTH_TOKEN_KEY);
  const hasAccessTokenVerified = useRef<boolean>(false);

  const verifyUser = async () => {
    try {
      const response = await axios.post("/authorize/verify/");
      console.log("verify user", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessTokenFromURL && typeof setAccessToken === "function") {
      setAccessToken(accessTokenFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !hasAccessTokenVerified.current &&
      typeof accessToken === "string" &&
      accessToken !== ""
    ) {
      hasAccessTokenVerified.current = true;
      verifyUser();
    }
  }, [accessToken]);

  return children;

  return !accessToken ? children : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
