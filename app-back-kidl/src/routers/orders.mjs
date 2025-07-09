import Product from '../models/product.mjs';
import Order from '../models/order.mjs';
import { Router } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware.mjs';
import { validateOrder } from '../middleware/validation.mjs';
import { handleValidationErrors } from '../middleware/validation.mjs';

const router = Router();

router.post(
    "/api/orders",
    authenticateToken,
    validateOrder,
    handleValidationErrors,
    async (req, res) => {
      const { products, shippingAddress, paymentMethod } = req.body;
  
      try {
        for (const item of products) {
          const product = await Product.findById(item.productId);
          if (!product) {
            return res.status(404).json({ error: `Product ${item.productId} not found` });
          }
  
          if (product.stock < item.quantity) {
            return res.status(400).json({
              error: `Sorry, ${product.name} is out of stock. Only ${product.stock} left.`,
            });
          }
        }
  
        const orderProducts = [];
        for (const item of products) {
          const product = await Product.findById(item.productId);
          product.stock -= item.quantity; 
          await product.save();
  
          orderProducts.push({
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          });
        }
  
        const totalAmount = orderProducts.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
  
        const newOrder = new Order({
          userId: req.user.id,
          products: orderProducts,
          totalAmount,
          paymentMethod,
          shippingAddress,
        });
  
        await newOrder.save();
        res.status(201).json(newOrder);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to place order" });
      }
    }
  );
  
router.get('/api/orders/history', authenticateToken, async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch order history' });
    }
  });

router.delete('/api/orders/:id',async(request,response)=>{
    const {id} = request;
    try{
      const findId = await Order.findById(id);
      const deletedId = await Order.deleteOne(findId);
      return response.status(200).send(deletedId);
    }catch(error){
      return response.status(400).send(error.message);
    }
  }) 


export default router;
  