import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'user', 'editor', 'guide'], default: 'user' },
  favorites: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
});

export default mongoose.model("User", userSchema);
