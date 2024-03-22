import type { ReactElement } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { children } = props;
  const pathParams = useParams();
  const [searchParams] = useSearchParams();
  const searchParamAccessToken = searchParams.get("abc");
  const studentId = pathParams.studentId;

  if (!searchParamAccessToken && !studentId) {
    return <Navigate to={"/login"} replace />;
  }

  console.log({ pathParams, searchParams: searchParams.get("accessToken") });

  /* You can grab your accessToken from your store here and manipulate your authenticated routes */
  const accessToken = "";

  return !accessToken ? children : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
