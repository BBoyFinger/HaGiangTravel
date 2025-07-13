import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    vi: { type: String, required: true },
    en: { type: String, required: true }
  },
  slug: { type: String, required: true, unique: true },
  content: {
    vi: { type: String, required: true },
    en: { type: String, required: true }
  },
  tags: {
    vi: [{ type: String }],
    en: [{ type: String }]
  },
  author: { type: String, required: true },
  thumbnail: { type: String, required: true },
  imageUrls: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'draft' }
});

blogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Blog", blogSchema); 