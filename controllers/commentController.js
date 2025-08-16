const Comment = require('../models/comment');

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const threadId = req.params.threadId;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      text,
      thread: threadId,
      createdBy: req.user._id
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Comments for a Thread
exports.getComments = async (req, res) => {
  try {
    const threadId = req.params.threadId;
    const comments = await Comment.find({ thread: threadId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
