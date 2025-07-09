import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import { validateSignup } from "./validation.mjs";
import bcrypt from 'bcryptjs';

const ACCESS_TOKEN_SECRET = "admin";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log(authHeader);
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid access token" });
  }
};


export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
  
    if (req.user.role !== 1) {
      return res.status(403).json({ error: "Admin access required." });
    }
  
    next();
  };
  
  



