import express from 'express';
import { login, refreshToken, logout, signup } from '../controllers/AuthController.mjs';
import { authenticateToken, verifyAdmin } from '../middleware/AuthMiddleware.mjs';
import { validateSignup } from '../middleware/validation.mjs';
import User from '../models/user.mjs';

const router = express.Router();

router.post('/api/auth/login', login);
router.post('/refresh', refreshToken);
router.post('/api/auth/logout', logout);
router.post('/api/auth/signup',validateSignup,signup);
router.get('/api/auth/admin', verifyAdmin, async (req, res) => {
    try {
      const users = await User.find({}); 
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users." });
    }
  });

router.get("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || {},
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile." });
    }
  });
  

export default router;



router.put("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;
  
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }
  
      const updatedData = {
        name,
        email,
        phone,
        address: {
          street: address?.street || "",
          city: address?.city || "",
          zipCode: address?.zipCode || "",
          country: address?.country || "",
        },
        updatedAt: Date.now(),
      };
  
      const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile." });
    }
  });