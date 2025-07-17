const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const {
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
<<<<<<< HEAD
<<<<<<< HEAD
const { refreshAccessToken } = require('../controllers/authController');
=======
const { logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
<<<<<<< HEAD
>>>>>>> feat/logout_api
=======
const checkAuth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
>>>>>>> feat/emailVerificationAfterSignup
=======
const { requestPasswordReset } = require('../controllers/authController');
const { resetPassword } = require('../controllers/authController');
>>>>>>> feat/password-reset

// Signup & Login Routes
router.post('/signup', signup);
router.post('/login', login);
router.put('/update', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.delete('/delete', authenticateToken, deleteAccount);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/logout', authController.logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword)

// Protected route
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Protected route access granted',
    user: req.user,
  });
});

<<<<<<< HEAD
<<<<<<< HEAD
router.post('/token', refreshAccessToken);

router.post('/logout', requireAuth, logout);
=======
router.post('/token', authController.refreshToken);

router.post('/logout', authenticate, logout);
>>>>>>> feat/logout_api

router.get('/verify-email', verifyEmail);
=======
//Refresh Token
router.post('/refresh-token', authController.refreshToken);
>>>>>>> feat/product

module.exports = router;
