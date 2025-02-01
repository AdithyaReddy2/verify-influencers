import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from "@mui/material";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import InfluencerDetail from "./components/InfluencerDetail";
import shieldLogo from "./assets/shield-logo.png"; // Ensure you have a shield logo image in the assets folder
import './App.css'; // Import the CSS file

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage or context
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <img src={shieldLogo} alt="Shield Logo" className="logo" />
        <Typography variant="h6" className="title">
          Verify Influencers
        </Typography>
        <Button color="inherit" component={Link} to="/leaderboard" className="nav-button">
          Leaderboard
        </Button>
        <Button color="inherit" component={Link} to={`/influencers/${localStorage.getItem("userId")}`} className="nav-button">
          My Profile
        </Button>
        <Button color="inherit" onClick={handleLogout} className="nav-button">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!hideNavBar && <NavBar />}
      <Box sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/influencers/:id" element={<InfluencerDetail />} />
        </Routes>
      </Box>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Box className="app-container">
        <AppContent />
      </Box>
    </Router>
  );
}
