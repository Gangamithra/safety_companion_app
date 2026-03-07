import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// Parse JSON
app.use(express.json());

// CORS setup for frontend and Postman testing
app.use(cors({
  origin: ["http://localhost:3000", "*"], // allow frontend & all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend running"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));