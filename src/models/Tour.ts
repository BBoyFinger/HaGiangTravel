import mongoose from "mongoose"

const priceSchema = new mongoose.Schema({
  perSlot: { type: Number, required: true },
  groupPrice: { type: Number },
  discountPrice: { type: Number }
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  activities: [{ type: String, required: true }]
}, { _id: false });

const tourSchema = new mongoose.Schema({
  name: {
    vi: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
  },
  slug: { type: String, required: true, unique: true },
  type: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  description: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  shortDescription: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  locations: [{
    vi: { type: String, required: true },
    en: { type: String, required: true },
  }],
  imageUrls: [{
    type: String,
    required: true,
  }],
  // Giá nhiều loại tiền tệ
  price: {
    type: Map,
    of: priceSchema,
    required: true
  },
  duration: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  guideLanguage: [{
    vi: { type: String, required: true },
    en: { type: String, required: true },
  }],
  includedServices: [{
    vi: { type: String, required: true },
    en: { type: String, required: true },
  }],
  excludedServices: [{
    vi: { type: String },
    en: { type: String },
  }],
  // Lịch trình dạng nhiều ngày
  schedule: {
    vi: [dayScheduleSchema],
    en: [dayScheduleSchema]
  },
  rating: { type: Number, default: 0 },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model("Tour", tourSchema);