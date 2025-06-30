require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const db = require('./config/db');
const User = require('./models/User'); // add this line
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start the server after DB sync
const PORT = process.env.PORT || 5000;

db.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Failed to connect DB:', err));
