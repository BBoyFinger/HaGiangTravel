import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: {
    vi: { type: String, required: true },
    en: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  images: [{ type: String }],
  shortDescription: {
    vi: { type: String },
    en: { type: String }
  },
  description: {
    vi: { type: String },
    en: { type: String }
  },
  location: {
    address: {
      vi: { type: String },
      en: { type: String }
    }
  },
 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Destination", destinationSchema); 