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
    element: getProtectedRoute(<Dashboard />),
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
