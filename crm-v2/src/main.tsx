import { QueryClient } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { AppWrapper } from "./AppWrapper";

import "./index.css";
import { ErrorPage } from "./pages/error/ErrorPage";
import { ExamplePage1 } from "./pages/example-page-1/Example-page-1";
import Home from "./pages/home/Home";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper queryClient={queryClient} />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <div>Loading...</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/example-page-1",
        element: <ExamplePage1 />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
