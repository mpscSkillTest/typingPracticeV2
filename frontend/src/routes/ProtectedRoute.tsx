import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "../utils/constant";
import axios from "../config/customAxios";
import { getHashParams, getCookieHandlers } from "../utils/utils";

type ProtectedRouteProps = {
  children: ReactElement;
};

type UserValidity = boolean | undefined;

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const hashParams = getHashParams();
  const [isValidUser, setIsValidUser] = useState<UserValidity>(undefined);

  const {
    removeCookie: removeAccessToken,
    getUpdatedCookie: getAccessToken,
    setCookieValue: setAccessToken,
  } = getCookieHandlers(AUTH_TOKEN_KEY)();

  const accessToken = getAccessToken();

  const accessTokenFromURL = hashParams[AUTH_TOKEN_KEY] || "";
  const type = hashParams["type"];

  const { children } = props;

  const verifyUser = async (
    updatedAccessToken: string = "",
    type: string = ""
  ) => {
    let updatedIsValidUser = false;
    try {
      const response = await axios.post("/authorize/verify/", {
        type,
        accessToken: updatedAccessToken,
      });
      const { data } = response || {};
      const { error, token } = data || {};
      if (error) {
        throw new Error(error);
      }
      if (token) {
        setAccessToken(token);
      }
      updatedIsValidUser = true;
    } catch (err) {
      console.error({ err });
      removeAccessToken();
      updatedIsValidUser = false;
    }
    return updatedIsValidUser;
  };

  useEffect(() => {
    if (accessToken || (accessTokenFromURL && type)) {
      if (typeof accessTokenFromURL === "string" && accessTokenFromURL !== "") {
        verifyUser(accessTokenFromURL, type).then((isValid) => {
          setIsValidUser(isValid);
        });
      } else if (accessToken) {
        verifyUser(accessToken).then((isValid) => {
          setIsValidUser(isValid);
        });
      }
    } else {
      setIsValidUser(false);
    }
  }, []);

  if (isValidUser === undefined) {
    return null;
  }

  return isValidUser ? children : <Navigate to={"/signin"} replace />;
};

export default ProtectedRoute;
