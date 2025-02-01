import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Leaderboard() {
  const [influencers, setInfluencers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://verify-influencers-backend.onrender.com/api/influencers")
      .then((res) => {
        console.log("Fetched influencers:", res.data);
        setInfluencers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Prepare data for the pie chart (example: followers by category)
  const categoryFollowerData = influencers.reduce((acc, influencer) => {
    const category = influencer.category || "Unknown";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += influencer.followers || 0;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryFollowerData).map((category) => ({
    name: category,
    value: categoryFollowerData[category],
  }));

  // Prepare data for trust score distribution
  const trustScoreData = [
    { name: "High Trust (80-100%)", value: influencers.filter((i) => i.trustScore >= 80).length },
    { name: "Medium Trust (50-79%)", value: influencers.filter((i) => i.trustScore >= 50 && i.trustScore < 80).length },
    { name: "Low Trust (0-49%)", value: influencers.filter((i) => i.trustScore < 50).length },
  ];

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <style>
        {`
          body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .content {
            flex: 1;
          }
        `}
      </style>
      <Grid container spacing={3} className="content">
        {/* Pie Chart for Followers by Category */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6" align="center" gutterBottom>
              Followers by Category
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart for Trust Score Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6" align="center" gutterBottom>
              Trust Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trustScoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trustScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Leaderboard Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Trust Score</TableCell>
                  <TableCell>Followers</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {influencers.map((influencer) => (
                  <TableRow key={influencer._id}>
                    <TableCell>
                      <img
                        src={influencer.profilePicture || "/default-profile.png"}
                        alt={influencer.username}
                        style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 16 }}
                      />
                      {influencer.username}
                    </TableCell>
                    <TableCell>{influencer.category}</TableCell>
                    <TableCell>{influencer.trustScore}%</TableCell>
                    <TableCell>{(influencer.followers || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => navigate(`/influencers/${influencer._id}`)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}