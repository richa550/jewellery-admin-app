// Navbar.js
import React from "react";
import { AppBar, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import "../style/dashboard.css";

function DBSideMenu() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <AppBar position="static">
            {token && (
                <>
                    <div className="db-userProfile">
                        <h3>Welcome, {user?.name}</h3>
                        <p className="userProfile-heading">Mobile No:</p>
                        <p>{user?.contact}</p>
                        

                    </div>
                    <List className="sidebar-menulist">
                        {[
                            { text: "Dashboard", path: "/dashboard" },
                            { text: "Invoices", path: "/invoice" },
                            { text: "Users", path: "/users" },
                            { text: "Bills", path: "/bills" },
                           
                        ].map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={Link} 
                                to={item.path}
                            >
                                <ListItemText primary={item.text}  className=""/>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </AppBar>
    );
}

export default DBSideMenu;
