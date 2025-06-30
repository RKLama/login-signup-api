const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Signup & Login Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Protected route access granted',
    user: req.user,
  });
});

module.exports = router;
