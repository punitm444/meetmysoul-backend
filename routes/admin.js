// routes/admin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 📌 Register an Admin
router.post("/register-admin", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        await user.save();

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            role: user.role,
            msg: "Admin created successfully",
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 📌 Get all users (admin only)
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // exclude password
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 📌 Delete user by ID (🚫 block deleting admins)
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.role === "admin") {
            return res.status(403).json({ msg: "Admins cannot be deleted" });
        }

        await user.deleteOne();
        res.json({ msg: "User removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
