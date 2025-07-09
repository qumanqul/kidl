import express from "express";
import User from "../models/user.mjs";
import Product from "../models/product.mjs";
import Order from "../models/order.mjs";
import { authenticateToken, verifyAdmin } from "../middleware/AuthMiddleware.mjs";
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});


router.post("/api/admin/users", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      passwordHash: hashedPassword, 
      role: role || 0,
      phone,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user." });
  }
});

router.put("/api/admin/users/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user." });
  }
});

router.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

router.get("/api/admin/products",async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

router.post("/api/admin/products",async (req, res) => {
  try {
    const { name, price, description,category,stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product." });
  }
});

router.put("/api/admin/products/:id",async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." });
  }
});

router.delete("/api/admin/products/:id",async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

router.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

router.put("/api/admin/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order." });
  }
});

router.delete("/api/admin/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Order deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order." });
  }
});

export default router;
