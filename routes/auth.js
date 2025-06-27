const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');

// Signup Route
router.post('/signup', signup);

// ✅ Test route to verify routing works
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth route is working!' });
});

module.exports = router;
