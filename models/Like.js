const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
      postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);