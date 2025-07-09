import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.mjs';
import { check, validationResult } from "express-validator"; 


const ACCESS_TOKEN_SECRET = 'admin'; // Replace with a strong secret key
const REFRESH_TOKEN_SECRET = 'refre'; // Replace with a strong secret key

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid email" });
  
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
  
      user.refreshTokens.push(refreshToken);
      await user.save();
  
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });
  
    try {
    
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  
      const user = await User.findById(decoded.id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }
  
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    } catch (err) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  };
  

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};


export const signup = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password, phone, address } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        name,
        email,
        passwordHash: hashedPassword,
        phone,
        address,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

