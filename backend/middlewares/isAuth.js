// backend/middlewares/isAuth.js
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token; // make sure frontend sends cookie
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId; // ✅ set userId
    next();
  } catch (error) {
    console.error("isAuth error:", error.message);
    return res.status(403).json({ message: `Auth failed: ${error.message}` });
  }
};

export default isAuth;
