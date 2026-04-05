require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Violation = require("./models/Violation");
const User = require("./models/Users");

const app = express();
app.use(cors());
app.use(express.json());

// ─── DB CONNECTION ────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error:", err));

// ─── JWT MIDDLEWARE ───────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const officerOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "officer") return next();
  res.status(403).json({ error: "Access denied" });
};

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

// SIGNUP
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: "All fields are required" });
    if (!["admin", "officer", "citizen"].includes(role))
      return res.status(400).json({ error: "Invalid role" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET CURRENT USER
app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── VIOLATION ROUTES ─────────────────────────────────────────────────────────

// GET ALL VIOLATIONS
app.get("/violations", authMiddleware, officerOrAdmin, async (req, res) => {
  try {
    const data = await Violation.find().sort({ time: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD VIOLATION
app.post("/violations", authMiddleware, officerOrAdmin, async (req, res) => {
  try {
    const { vehicleNo, location, type, severity, fine, status, time } = req.body;
    if (!vehicleNo || !location || !type || !severity || !fine)
      return res.status(400).json({ error: "Missing required fields" });
    const newViolation = new Violation({
      vehicleNo: vehicleNo.toUpperCase(),
      location,
      type,
      severity,
      fine: Number(fine),
      status: status || "Pending",
      time: time ? new Date(time) : new Date(),
    });
    await newViolation.save();
    res.status(201).json({ message: "Violation added successfully", violation: newViolation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE VIOLATION (admin only)
app.delete("/violations/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    await Violation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE VIOLATION STATUS
app.put("/violations/:id", authMiddleware, officerOrAdmin, async (req, res) => {
  try {
    const updated = await Violation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CITIZEN PORTAL ───────────────────────────────────────────────────────────

// LOOKUP VIOLATIONS BY VEHICLE NUMBER
app.get("/citizen/:vehicleNo", authMiddleware, async (req, res) => {
  try {
    const vehicleNo = req.params.vehicleNo.toUpperCase();
    const violations = await Violation.find({ vehicleNo }).sort({ time: -1 });
    res.json({
      vehicle: vehicleNo,
      violations: violations.map((v) => ({
        id: v._id,
        type: v.type,
        location: v.location,
        date: v.time,
        fine: v.fine,
        status: v.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PAY A FINE
app.put("/citizen/pay/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Violation.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    );
    res.json({ message: "Payment recorded", violation: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));