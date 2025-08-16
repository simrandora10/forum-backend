const Reply = require('../models/reply');
const Thread = require('../models/Thread');

// ✅ Create Reply (supports nested replies)
exports.createReply = async (req, res) => {
  try {
    const { content, parentReplyId } = req.body;
    const { threadId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const reply = await Reply.create({
      content,
      thread: threadId,
      parentReplyId: parentReplyId || null,
      createdBy: req.user._id
    });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all replies for a thread
exports.getRepliesByThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const replies = await Reply.find({ thread: threadId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Reply
exports.updateReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    reply.content = req.body.content || reply.content;
    const updatedReply = await reply.save();

    res.json(updatedReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await reply.deleteOne();
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Vote on Reply (upvote/downvote toggle)
exports.voteReply = async (req, res) => {
  try {
    const { value } = req.body; // 1 = upvote, -1 = downvote
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const existingVote = reply.votes.find(
      (v) => v.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle off (remove vote if same value again)
        reply.votes = reply.votes.filter(
          (v) => v.user.toString() !== req.user._id.toString()
        );
      } else {
        existingVote.value = value; // update vote
      }
    } else {
      reply.votes.push({ user: req.user._id, value });
    }

    await reply.save();

    const totalVotes = reply.votes.reduce((sum, v) => sum + v.value, 0);

    res.json({
      message: "Reply vote updated successfully",
      totalVotes,
      voters: reply.votes.length,
      votes: reply.votes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
