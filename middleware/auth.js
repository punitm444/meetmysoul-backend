// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization") || req.header("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // we used payload: { user: { id: user.id } }
        req.user = decoded.user; // { id: ... }
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
