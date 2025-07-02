import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: String, required: true },
  thumbnail: { type: String, required: true },
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