const express = require('express');
const { signup, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Protected test route
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Profile accessed successfully',
    user: req.user
  });
});

module.exports = router;
