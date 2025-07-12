const { Notification, User } = require('../models');

// Create a new notification (e.g., for order updates, messages, etc.)
const createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    const notification = await Notification.create({
      userId,
      type,
      message
    });

    res.status(201).json({ message: 'Notification created', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notifications for the current user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
};
