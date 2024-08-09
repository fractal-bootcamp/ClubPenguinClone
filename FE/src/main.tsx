import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Room from "../components/common/Room.tsx";
import MapCreator from "./MapCreator.tsx";
import Garden from "../components/pages/Garden.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Room />,
  },
  {
    path: "/map-creator",
    element: <MapCreator />,
  },
  {
    path: "/garden",
    element: <Garden width={"900"} height={"1200"} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
