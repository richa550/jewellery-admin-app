// Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, email, password })
    });
    console.log("body", JSON.stringify({ name, contact, email, password }));
    console.log("res", res);
    const data = await res.json();
    console.log("data", data);
    if (res.ok) {
      alert("Signup successful! Please login now.");
      //onSignup({ email, password }); // optional: update state
      navigate("/login");
    } else {
      alert(data.msg || "Signup failed");
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="tel" placeholder="Enter Contact No" value={contact} onChange={(e) => setContact(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
