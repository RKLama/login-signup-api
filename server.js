require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const db = require('./config/db');
const User = require('./models/User'); // add this line
const userRoutes = require('./routes/users');
<<<<<<< HEAD
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
=======
const orderRoutes = require('./routes/orders');
<<<<<<< HEAD
>>>>>>> feat/order
=======
const reviewRoutes = require('./routes/reviews');
<<<<<<< HEAD
>>>>>>> feat/reviews
=======
const wishlistRoutes = require('./routes/wishlist');
<<<<<<< HEAD
>>>>>>> feat/wishlist
=======
const adminRoutes = require('./routes/admin');
<<<<<<< HEAD
>>>>>>> feat/admin-dashboard
=======
const notificationRoutes = require('./routes/notifications');
>>>>>>> feat/notifications

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
<<<<<<< HEAD
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
=======
app.use('/api/orders', orderRoutes);
<<<<<<< HEAD
>>>>>>> feat/order
=======
app.use('/api/reviews', reviewRoutes);
<<<<<<< HEAD
>>>>>>> feat/reviews
=======
app.use('/api/wishlist', wishlistRoutes);
<<<<<<< HEAD
>>>>>>> feat/wishlist
=======
app.use('/api/payments', require('./routes/payments'));
<<<<<<< HEAD
>>>>>>> feat/payments
=======
app.use('/api/admin', adminRoutes);
<<<<<<< HEAD
>>>>>>> feat/admin-dashboard
=======
app.use('/api/notifications', notificationRoutes);
>>>>>>> feat/notifications

// Start the server after DB sync
const PORT = process.env.PORT || 5000;

db.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Failed to connect DB:', err));
