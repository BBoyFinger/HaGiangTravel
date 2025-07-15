import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true }, // id của blog/tour/destination
  refType: { type: String, enum: ['blog', 'tour', 'destination'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

commentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Comment", commentSchema); 