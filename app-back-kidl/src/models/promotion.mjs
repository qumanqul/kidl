import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    discountPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    appliesTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Produkty objęte promocją
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Promotion', promotionSchema);
  