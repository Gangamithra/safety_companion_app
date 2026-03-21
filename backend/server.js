require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const User = require("./models/User");

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://safety-companion-app.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

/* ---------------- ROUTES ---------------- */

const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);

const sosRoutes = require("./routes/sos");
app.use("/api/sos", sosRoutes);

/* ---------------- ENV VARIABLES ---------------- */

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

/* ---------------- CONNECT MONGODB ---------------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------------- SIGNUP ---------------- */

app.post("/signup", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- LOGIN ---------------- */

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===================================================== */
/* 🔐 SIMPLE RESET PASSWORD (FINAL VERSION) */
/* ===================================================== */

app.post("/api/simple-reset-password", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

/* ---------------- AUTH MIDDLEWARE ---------------- */

function authMiddleware(req, res, next) {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }

}

/* ---------------- GET USER INFO ---------------- */

app.get("/api/auth/me", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});