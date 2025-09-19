const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000", // dev frontend
  "https://task-forge-a4vqhcfy6-aruns-projects-c7268ce7.vercel.app", // Vercel frontend
  "https://task-forge-d78i.onrender.com" // optional: backend URL itself
];

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: ${origin} not allowed`));
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌  MongoDB Connection Failed:", err);
    process.exit(1);
  });

// Basic middleware to parse JSON
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));