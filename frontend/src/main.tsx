import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authentication from "./routes/Authentication";
import Dashboard from "./routes/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorPage from "./routes/ErrorPage.tsx";
import "./index.css";

const getProtectedRoute = (component: ReactElement) => {
  return <ProtectedRoute>{component}</ProtectedRoute>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: getProtectedRoute(<Dashboard page="dashboard" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/practice",
    element: getProtectedRoute(<Dashboard page="practice" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/speed-test",
    element: getProtectedRoute(<Dashboard page="speedTest" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/subscription",
    element: getProtectedRoute(<Dashboard page="subscription" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/transaction",
    element: getProtectedRoute(<Dashboard page="transaction"/>),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Authentication type="signin" />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Authentication type="signup" />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirm-signup",
    element: <Authentication type="confirm-signup" />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password",
    element: <Authentication type="reset-password" />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
