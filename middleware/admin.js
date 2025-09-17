// middleware/admin.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
    const authHeader = req.header("Authorization") || req.header("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(401).json({ msg: "User not found" });
        if (!user.isAdmin) return res.status(403).json({ msg: "Access denied. Admins only." });

        req.user = user; // full user document for convenience
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
