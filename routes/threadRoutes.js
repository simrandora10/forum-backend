const express = require('express');
const { createThread, getThreads, getThreadById, updateThread, deleteThread, voteThread } = require('../controllers/ThreadController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createThread);
router.get('/', getThreads);
router.get('/:id', getThreadById);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);
router.post('/:id/vote', protect, voteThread);   // NEW ✅

module.exports = router;
