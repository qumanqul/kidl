import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' }, // 'pending', 'completed', 'cancelled'
    paymentMethod: { type: String, default: 'credit_card' }, // lub 'paypal'
    shippingAddress: {
      street: String,
      city: String,
      zipCode: String,
      country: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Order = mongoose.model("Order",orderSchema);
  export default Order;
  