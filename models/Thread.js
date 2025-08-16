const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // ✅ ref added
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      value: { type: Number } // +1 for upvote, -1 for downvote
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// ✅ Virtual field to calculate total vote score
threadSchema.virtual('voteScore').get(function () {
  return this.votes.reduce((sum, v) => sum + v.value, 0);
});

// ✅ Ensure virtuals are included in JSON responses
threadSchema.set('toJSON', { virtuals: true });
threadSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Thread', threadSchema);
