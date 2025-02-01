import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Box, Grid, Avatar } from "@mui/material";
import axios from "axios";

export default function InfluencerDetail() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);

  useEffect(() => {
    axios.get(`https://verify-influencers-backend.onrender.com/api/influencers/${id}`)
      .then((res) => setInfluencer(res.data))
      .catch((err) => console.error("Failed to fetch influencer:", err));
  }, [id]);

  if (!influencer) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Display Profile Picture and Username */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          src={influencer.profilePicture || "/default-profile.png"} // Use a default image if no profile picture
          alt={influencer.username}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <Typography variant="h4" gutterBottom>{influencer.username}</Typography>
      </Box>

      {/* Display Influencer Details */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6">Category</Typography>
            <Typography>{influencer.category}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6">Trust Score</Typography>
            <Typography>{influencer.trustScore}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
            <Typography variant="h6">Followers</Typography>
            <Typography>{(influencer.followers || 0).toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#fce4ec' }}>
            <Typography variant="h6">Bio</Typography>
            <Typography>{influencer.bio || "No bio available."}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#ede7f6' }}>
            <Typography variant="h6">Website</Typography>
            <Typography>
              <a href={influencer.website} target="_blank" rel="noopener noreferrer">
                {influencer.website || "No website available."}
              </a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Display Claims */}
      <Typography variant="h5" sx={{ mt: 3 }}>Claims</Typography>
      {influencer.claims?.length > 0 ? (
        influencer.claims.map((claim, index) => (
          <Paper key={index} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
            <Typography>{claim.claimText}</Typography>
            <Typography>Status: {claim.status}</Typography>
            <Typography>Confidence: {claim.confidence}%</Typography>
            <Typography>Source: {claim.source}</Typography>
          </Paper>
        ))
      ) : (
        <Typography sx={{ mt: 2 }}>No claims available.</Typography>
      )}
    </Box>
  );
}