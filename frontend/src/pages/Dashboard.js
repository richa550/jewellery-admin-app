import React from "react";
import {
    Typography,
    Drawer,
    Box,
} from "@mui/material";
import DBSideMenu from "../components/DashboardSideMenu";

const drawerWidth = 240;

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
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

                <Typography variant="h4" gutterBottom>
                    Welcome to your Dashboard
                </Typography>
                <Typography>
                    <div>
                        <h1>Welcome, {user?.name}</h1>
                        <h3>Contact No:, {user?.contact}</h3>
                        <h3>Email:, {user?.email}</h3>
                    </div>
                </Typography>

               
            </Box>
        </Box>
    );
}

export default Dashboard;
