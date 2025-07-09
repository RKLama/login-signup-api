const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const {
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const { refreshAccessToken } = require('../controllers/authController');

// Signup & Login Routes
router.post('/signup', signup);
router.post('/login', login);
router.put('/update', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.delete('/delete', authenticateToken, deleteAccount);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected route
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Protected route access granted',
    user: req.user,
  });
});

router.post('/token', refreshAccessToken);

module.exports = router;
