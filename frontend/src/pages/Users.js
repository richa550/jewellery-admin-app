import React from "react";
import {
  Drawer,
  Box,
} from "@mui/material";
import DBSideMenu from "../components/DashboardSideMenu";
const drawerWidth = 240;

function Users() {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          flexGrow: 1,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <DBSideMenu />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <div>
          <h2>Users List</h2>
        </div>
      </Box>
    </Box>

  );
}

export default Users;
