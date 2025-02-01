const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer"); // For file uploads
const path = require("path"); // For handling file paths
const fs = require("fs"); // For file system operations
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  profilePicture: String, // Store the file path or URL
  category: String,
  trustScore: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  claims: [{
    claimText: String,
    status: { type: String, enum: ["Verified", "Questionable", "Debunked"] },
    confidence: Number,
    source: String,
  }],
});

const User = mongoose.model("User", userSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the "uploads" directory exists
    const uploadDir = "../frontend/public";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files from the "uploads" folder
app.use("../frontend/public", express.static("uploads"));

// Signup Endpoint with Profile Picture Upload
app.post("/api/signup", upload.single("profilePicture"), async (req, res) => {
  try {
    const { username, email, password, category, trustScore, followers } = req.body;
    const profilePicture = req.file ? `${req.file.filename}` : null;

    // Validate input
    if (!username || !email || !password || !category || !trustScore || !followers) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, profilePicture, category, trustScore, followers });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Return user ID and email (username)
  res.json({ userId: user._id, email: user.email });
});

// Simulated Claim Verification
app.post("/api/verify", async (req, res) => {
  const { claimText } = req.body;

  // Simulate verification logic
  const statusOptions = ["Verified", "Questionable", "Debunked"];
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const confidence = Math.floor(Math.random() * 100);

  res.json({
    claimText,
    status: randomStatus,
    confidence,
    source: "Simulated Research",
  });
});

// Fetch Influencers
app.get("/api/influencers", async (req, res) => {
  try {
    const influencers = await User.find();
    console.log("Fetched influencers:", influencers); // Log the fetched data
    res.json(influencers);
  } catch (err) {
    console.error("Failed to fetch influencers:", err);
    res.status(500).json({ error: "Failed to fetch influencers" });
  }
});

// Fetch Influencer Details
app.get("/api/influencers/:id", async (req, res) => {
  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid influencer ID" });
    }

    const influencer = await User.findById(req.params.id); // Use User model
    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }
    res.json(influencer);
  } catch (err) {
    console.error("Failed to fetch influencer details:", err);
    res.status(500).json({ error: "Failed to fetch influencer details" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));