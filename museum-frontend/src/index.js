import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import ImageUpload from "./components/ImageUpload";
import Home from "./components/Home";
import ImageSearch from "./components/ImageSearch";
import QrScanner from "./components/QRCodeReader";
import ItemDetail from "./components/Item";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/item/:id",
        element: <ItemDetail />,
      },
      {
        path: "/upload",
        element: <ImageUpload />,
      },
      {
        path: "/search",
        element: <ImageSearch />,
      },
      {
        path: "/scan",
        element: <QrScanner />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
