// models/Thread.js
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      value: { type: Number } // +1 for upvote, -1 for downvote
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', threadSchema);
