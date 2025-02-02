import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import multer from "multer"; // For file uploads
import path from "path"; // For file paths
import fs from "fs"; // For file system operations
import dotenv from "dotenv"; // For environment variables

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve(); // Use this to serve static files

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
    // Ensure the "dist" directory exists
    const uploadDir = path.join(__dirname, "../frontend/dist");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save files in the "dist" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files from the "dist" folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Signup Endpoint with Profile Picture Upload
app.post("/api/signup", upload.single("profilePicture"), async (req, res) => {
  try {
    const { username, email, password, category, trustScore, followers } = req.body;
    const profilePicture = req.file ? `/dist/${req.file.filename}` : null;

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

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Anything that doesn't match the above, send back the index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/dist", "index.html"));
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));