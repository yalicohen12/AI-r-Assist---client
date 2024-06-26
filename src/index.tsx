import React from "react";
import ReactDOM from "react-dom/client";
// import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./state";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer></ToastContainer>
    </Provider>
  // </React.StrictMode>
);
