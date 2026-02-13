import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authentication from "./routes/Authentication";
import Dashboard from "./routes/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorPage from "./routes/ErrorPage.tsx";
import "./index.css";
import OAuthCallback from "./components/Authentication/Login/oAuthCallback.tsx";
import TermsAndConditions from "./routes/TermsAndConditions.tsx";
import PrivacyPolicy from "./routes/PrivacyPolicy.tsx";
import RefundPolicy from "./routes/RefundPolicy.tsx";
import ContactUs from "./routes/ContactUs.tsx";
const getProtectedRoute = (component: ReactElement) => {
  return <ProtectedRoute>{component}</ProtectedRoute>;
};

const router = createBrowserRouter([
  {
    path: "/auth/callback",
    element: <OAuthCallback />,
    errorElement: <ErrorPage />,
  },
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
    path: "/mock-test",
    element: getProtectedRoute(<Dashboard page="mockTest" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/subscription",
    element: getProtectedRoute(<Dashboard page="subscription" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/transaction",
    element: getProtectedRoute(<Dashboard page="transaction" />),
    errorElement: <ErrorPage />,
  },

  {
    path: "/lesson",
    element: getProtectedRoute(<Dashboard page="lesson" />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/lesson/:subject/:id",
    element: getProtectedRoute(<Dashboard page="lessonDetails" />),
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
  {
    path: "/terms",
    element: <TermsAndConditions />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/refund",
    element: <RefundPolicy />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
