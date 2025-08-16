const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:threadId', protect, addComment);
router.get('/:threadId', getComments);

module.exports = router;
