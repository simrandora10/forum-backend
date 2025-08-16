const User = require('../models/User');
const Thread = require('../models/Thread');
const Reply = require('../models/reply');

// Get user profile + threads + replies
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Fetch threads created by user with voteScore
    const threads = await Thread.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Add voteScore manually (in case virtual not applied)
    threads.forEach(t => {
      t.voteScore = t.votes.reduce((sum, v) => sum + v.value, 0);
    });

    // ✅ Fetch replies created by user, also include thread info
    const replies = await Reply.find({ createdBy: req.user._id })
      .populate('thread', 'title') // thread title only
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    replies.forEach(r => {
      r.voteScore = r.votes.reduce((sum, v) => sum + v.value, 0);
    });

    res.json({
      user,
      stats: {
        totalThreads: threads.length,
        totalReplies: replies.length
      },
      threads,
      replies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
