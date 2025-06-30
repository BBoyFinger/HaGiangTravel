import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  shortSpecs: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});

export default mongoose.model("Vehicle", vehicleSchema); 