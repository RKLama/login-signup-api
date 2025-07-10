const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const {
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const { logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

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

router.post('/token', authController.refreshToken);

router.post('/logout', authenticate, logout);

router.get('/verify-email', verifyEmail);

module.exports = router;
