import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import axios from "axios";

export default function Dashboard() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get username

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) navigate("/login"); // Redirect if not logged in
  }, [navigate]);

  const handleVerify = async () => {
    try {
      const res = await axios.post("/api/verify", { claimText: claim });
      setResult(res.data);
    } catch (err) {
      alert("Verification failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="h6">Welcome, {username}</Typography> {/* Display username */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Enter Health Claim"
          fullWidth
          margin="normal"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
        />
        <Button variant="contained" onClick={handleVerify}>
          Verify Claim
        </Button>
      </Paper>
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography>Status: {result.status}</Typography>
          <Typography>Confidence: {result.confidence}%</Typography>
          <Typography>Source: {result.source}</Typography>
        </Paper>
      )}
      <Button variant="contained" onClick={() => navigate("/leaderboard")} sx={{ mt: 3 }}>
        Go to Leaderboard
      </Button>
    </Box>
  );
}
