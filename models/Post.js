const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  texto: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);