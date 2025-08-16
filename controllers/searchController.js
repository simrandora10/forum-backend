const Thread = require('../models/Thread');
const Reply = require('../models/reply');

// Search in Threads + Replies
exports.searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Threads search
    const threads = await Thread.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).populate("createdBy", "name email");

    // Replies search
    const replies = await Reply.find({
      content: { $regex: query, $options: "i" }
    }).populate("createdBy", "name email");

    res.json({
      totalThreads: threads.length,
      totalReplies: replies.length,
      threads,
      replies
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
