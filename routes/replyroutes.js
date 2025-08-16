const express = require('express');
const { 
  createReply, 
  getRepliesByThread, 
  updateReply, 
  deleteReply, 
  voteReply 
} = require('../controllers/replyController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:threadId', protect, createReply);        // Create reply
router.get('/:threadId', getRepliesByThread);           // Get all replies for a thread
router.put('/:id', protect, updateReply);               // Update reply
router.delete('/:id', protect, deleteReply);            // Delete reply
router.post('/:id/vote', protect, voteReply);           // ✅ Vote on reply

module.exports = router;
