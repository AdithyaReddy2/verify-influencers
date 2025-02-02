import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [category, setCategory] = useState("");
  const [trustScore, setTrustScore] = useState(0);
  const [followers, setFollowers] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profilePicture", profilePicture);
      formData.append("category", category);
      formData.append("trustScore", trustScore);
      formData.append("followers", followers);

      const res = await axios.post("/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err.response?.data);
      alert("Signup failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="background" style={{width: "1351px"}}>
      <style>
        {`
          .background {
            background-image: url('/download.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }
          .form-container {
            background: rgba(255, 255, 255, 0.9);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            width: 100%;
            height: 100%;
            max-width: 600px;
            margin: 0 2rem;
          }
          .form-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .form-grid > * {
            flex: 1 1 calc(50% - 1rem);
          }
          .file-input {
            flex: 1 1 100%;
            margin-top: 1rem;

          }
        `}
      </style>
      <div className="form-container" style={{color: "black"}}>
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} className="form-grid">
          <TextField
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Category"
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <TextField
            label="Trust Score"
            type="number"
            margin="normal"
            value={trustScore}
            onChange={(e) => setTrustScore(e.target.value)}
            required
          />
          <TextField
            label="Followers"
            type="number"
            margin="normal"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            required
          />
          <div className="file-input">
            <Typography variant="body1" gutterBottom>
              Upload Profile Picture
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              required
            />
          </div>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
