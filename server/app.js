const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",                     // dev
  "https://task-forge-five.vercel.app",       // production frontend
  "https://task-forge-d78i.onrender.com"      // backend Render URL (optional)
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc.
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: ${origin} not allowed`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
