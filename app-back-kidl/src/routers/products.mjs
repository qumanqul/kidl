import { Router } from "express";
import Product from "../models/product.mjs";
import {body, validationResult, checkSchema} from 'express-validator';

const router = Router();



router.get("/api/products",async(request,response)=>{
    const products = await Product.find();
    return response.status(200).send(products);
  })


  router.get("/api/products/sinput", async (req, res) => {
    const { name } = req.query;
  
    try {
      const products = await Product.find({
        name: { $regex: name, $options: "i" }, 
      });
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  
  router.get('/api/products/:id',async(request,response)=>{
    const {id} = request.params;
    try{
      const product = await Product.findById(id);
      console.log(id);
      if (!product) return response.status(404).json({ error: "Product not found" });
      return response.json(product);
    }catch(error){
      return response.status(400).send(error.message);
    }
  })
  

  router.get("/api/products/search", async (req, res) => {
    try {
      const { name, category, minPrice, maxPrice, tags } = req.query;
  
      const query = {};
  
      if (name) {
        query.name = { $regex: name, $options: "i" }; }
  
      if (category) {
        query.category = category;
      }
  
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }
  
      if (tags) {
        const tagsArray = tags.split(","); 
        query.tags = { $in: tagsArray }; 
      }
  
      const products = await Product.find(query);
  
      res.status(200).json(products);
    } catch (error) {
      console.error("Error searching for products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.post("/api/products/buy", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: "Product ID and quantity are required." });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than zero." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        await product.purchase(quantity);

        res.status(200).json({
            message: `Successfully purchased ${quantity} of ${product.name}.`,
            remainingStock: product.stock,
        });
    } catch (error) {
        console.error("Error purchasing product:", error);
        res.status(500).json({ error: error.message || "Internal server error." });
    }
});

router.delete('/api/products/:id',async(request,response)=>{
    const {id} = request;
    try{
      const findId = await Product.findById(id);
      const deletedId = await Product.deleteOne(findId);
      return response.status(200).send(deletedId);
    }catch(error){
      return response.status(400).send(error.message);
    }
  })
  
router.post("/api/products", [
    body('name').notEmpty().withMessage('Name is required'),
    body('description')
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
      .optional(),
    body('price')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .notEmpty().withMessage('Category is required'),
    body('stock')
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
      .optional(),
    body('images')
      .isArray({ max: 5 }).withMessage('Images must be an array with up to 5 URLs')
      .optional(),
    body('isFeatured')
      .isBoolean().withMessage('isFeatured must be a boolean value')
      .optional(),
    body('tags')
      .isArray().withMessage('Tags must be an array')
      .optional(),
  ],
  async(request,response)=>{
    try{
      const { body } = request;
      const product = new Product(body);
      const newProduct = await product.save();
      response.status(201).send(newProduct);
      }catch(error){
          response.status(400).send(error.message);
     } 
  })
  



  export default router;
