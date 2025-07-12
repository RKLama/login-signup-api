const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// Get all notifications for logged-in user
router.get('/', authenticate, getUserNotifications);

// Create a new notification (optional: restrict to admin or system actions)
router.post('/', authenticate, createNotification);

// Mark a notification as read
router.patch('/:id/read', authenticate, markAsRead);

module.exports = router;
