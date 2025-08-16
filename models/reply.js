const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },
    parentReplyId: { type: mongoose.Schema.Types.ObjectId, ref: "Reply", default: null }, // nested replies
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] } // 1 = upvote, -1 = downvote
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
