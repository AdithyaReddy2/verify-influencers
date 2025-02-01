import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Link } from "@mui/material";
import axios from "axios";
import "./style.css"; // Import the CSS file from the same directory

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.email);
      navigate("/leaderboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      alert("Login failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div className="background">
      <div className="form-container" style={{color: "black"}}>
        <Typography variant="h4" gutterBottom align="center" >Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={handleSignupRedirect}
            sx={{ textDecoration: "none", cursor: "pointer" }}
          >
            Sign up
          </Link>
        </Typography>
      </div>
    </div>
  );
}