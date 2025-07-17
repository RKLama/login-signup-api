const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

router.use(authenticate, adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

router.get('/analytics', authenticate, authorizeAdmin, getAnalytics);

module.exports = router;
