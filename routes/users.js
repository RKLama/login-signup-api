const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllUsers);

module.exports = router;
