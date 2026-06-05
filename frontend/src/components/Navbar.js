// Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };


  return (

    <ul className="myaccount-menu-guest" style={{ display: "flex", gap: "15px", listStyle: "none" }}>
      {!token ? (
        <>
          <li className="guest-link"><Link to="/login">Login</Link></li>
          <li className="guest-link"><Link to="/signup">Signup</Link></li>
        </>
      ) : (
        <li style={{ position: "static" }}>
          <button
            onClick={() => setOpen(!open)}
            className="myaccount-btn"
          >
            My Account
          </button>
          {open && (
            <ul className="myaccount-menu">
              <li><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
              <li><Link to="/invoice" onClick={() => setOpen(false)}>Invoices</Link></li>
              <li><Link to="/bills" onClick={() => setOpen(false)}>All Invoice </Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          )}
        </li>
      )}
    </ul>

  );
}
export default Navbar;
