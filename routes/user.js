const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all paid users (protected)
router.get("/paid", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({ paid: true }).select("name gender");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
