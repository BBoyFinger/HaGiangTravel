import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String, required: true }],
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  priceFrom: { type: Number, required: true },
  currency: { type: String, required: true },
  detail: {
    fullDescription: { type: String, required: true }
  },
  relatedTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Destination", destinationSchema); 