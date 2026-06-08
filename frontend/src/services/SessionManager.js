// src/components/SessionManager.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SessionManager({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Logout after 30 min inactivity
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Reset timer on user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    // Start timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate]);

  useEffect(() => {
  const handleUnload = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
  };
}, []);

  return children;
}

export default SessionManager;
