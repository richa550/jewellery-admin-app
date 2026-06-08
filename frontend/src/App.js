// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import SessionManager from "./services/SessionManager";

function App() {
  return (
    <Router>
      <SessionManager>
      <Layout>
        <AppRoutes />
      </Layout>
      </SessionManager>
    </Router>
  );
}

export default App;
