import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file', 'system'], 
    default: 'text' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt on save
messageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
messageSchema.index({ from: 1, to: 1, createdAt: -1 });
messageSchema.index({ read: 1 });

export default mongoose.model("Message", messageSchema); 