import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  price_per_night: { type: String, required: true },
  rating: { type: Number, required: true },
  star_rating: { type: Number, required: true },
  images: [{ type: String, required: true }],
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  type: { type: String, enum: ['hotel', 'homestay'], required: true }
});

export default mongoose.model("Accommodation", accommodationSchema); 