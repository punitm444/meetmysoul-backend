require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// CORS setup (allow frontend access)
app.use(
    cors({
        origin: "*", // e.g., "https://meetmysoul.vercel.app" after frontend deploy
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Routes
app.use("/api/auth", require("./routes/auth"));   // Normal user auth
app.use("/api/admin", require("./routes/admin")); // Admin features

// Root endpoint
app.get("/", (req, res) => {
    res.send("🚀 Meet Mysoul backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
