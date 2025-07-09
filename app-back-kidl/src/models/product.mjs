import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [String],
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

productSchema.methods.purchase = async function (quantity) {
    if (this.stock < quantity) {
        throw new Error(`Not enough stock available for product: ${this.name}`);
    }
    this.stock -= quantity;
    await this.save();
};
  
const Product = mongoose.model('Product', productSchema);
export default Product;