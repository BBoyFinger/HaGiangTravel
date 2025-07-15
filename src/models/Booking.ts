import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  numberOfPeople: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  bookingDate: { type: Date, default: Date.now },
  travelDate: { type: Date, required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  }
});

export default mongoose.model("Booking", bookingSchema);
