// src/components/Layout.js
import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Jewellery App</Typography>
          <Box>
            <Navbar />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.200", p: 2, textAlign: "center" }}>
        <Typography variant="body2">© 2026 Jewellery App</Typography>
      </Box>
    </Box>
  );
}

export default Layout;
