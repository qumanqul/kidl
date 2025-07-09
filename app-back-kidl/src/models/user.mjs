import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: Number, default: 0, required: true }, // 'user' lub 'admin'
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String,
  },
  phone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  refreshTokens: [String]
});

const User = mongoose.model("User",userSchema);
export default User;
