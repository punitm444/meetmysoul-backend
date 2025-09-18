// middleware/admin.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
    const authHeader = req.header("Authorization") || req.header("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ now using decoded.id instead of decoded.user.id
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ msg: "User not found" });

        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied. Admins only." });
        }

        req.user = user; // attach full user doc
        next();
    } catch (err) {
        console.error("Admin auth error:", err.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};
