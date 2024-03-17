import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authentication from "./routes/Authentication";
import ErrorPage from "./routes/ErrorPage.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authentication />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
