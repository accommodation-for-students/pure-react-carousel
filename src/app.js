// This is a development app for local dev work on react-carousel
import React from "react";
import ReactDOM from "react-dom/client";
import DevelopmentApp from './App/App';

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <DevelopmentApp />
  </React.StrictMode>
);

