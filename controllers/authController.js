const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
<<<<<<< HEAD
<<<<<<< HEAD
const { RefreshToken } = require('../models');
const { v4: uuidv4 } = require('uuid');
=======
const RefreshToken = require('../models/RefreshToken');
const { Op } = require('sequelize');
>>>>>>> feat/logout_api
=======
const { createRefreshToken } = require('../utils/token');
<<<<<<< HEAD
>>>>>>> feat/product
=======
const sendEmail = require('../utils/sendEmail');
>>>>>>> feat/password-reset

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token and expiry
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour from now

    // Create user with verification fields
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: new Date(expiry),
      verified: false
    });

    // Setup nodemailer (Gmail example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourgmail@gmail.com',
        pass: 'your_app_password', // Use an App Password if 2FA is enabled
      },
    });

    // Build verification link
    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

    // Send email
    await transporter.sendMail({
      from: '"Your App" <yourgmail@gmail.com>',
      to: newUser.email,
      subject: 'Verify Your Email',
      html: `
        <h3>Welcome to our app!</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.status(201).json({
      message: 'User registered. Verification email sent.',
      user: {
        id: newUser.id,
        username,
        email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // short-lived
    );

    // Create refresh token (random UUID)
    const refreshToken = uuidv4();

    // Save refresh token in DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send tokens
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No user with this email' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = new Date(expiry);
    await user.save();

    // Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourgmail@gmail.com',
        pass: 'your_app_password', // Use App Password if 2FA
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Your App" <yourgmail@gmail.com>',
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Find token in DB
    const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Check if token expired
    if (new Date() > storedToken.expiryDate) {
      return res.status(403).json({ message: 'Refresh token expired' });
    }

    // Find the user
    const user = await User.findByPk(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Issue new access token
=======
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    // Find token in DB
    const storedToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      include: 'User'
    });

    if (!storedToken || !storedToken.User) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // Decode token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Revoke old token
    storedToken.isRevoked = true;
    await storedToken.save();

    // Generate new tokens
    const user = storedToken.User;

>>>>>>> feat/logout_api
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

<<<<<<< HEAD
    res.status(200).json({
      accessToken: newAccessToken,
    });

=======
    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await RefreshToken.create({
      token: newRefreshToken,
      UserId: user.id,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user.id;

  try {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken, UserId: userId }
    });

    if (!token) {
      return res.status(400).json({ message: 'Invalid or already revoked token' });
    }

    token.isRevoked = true;
    await token.save();

    res.status(200).json({ message: 'Logged out successfully' });
>>>>>>> feat/logout_api
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

<<<<<<< HEAD
const logout = async (req, res) => {
  const userId = req.user.id;

  try {
    await RefreshToken.destroy({ where: { userId } });
    res.status(200).json({ message: 'Logged out successfully. Refresh token deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong during logout' });
  }
};

module.exports = { signup, login, updateProfile, changePassword, deleteAccount, requestPasswordReset, refreshAccessToken, logout };
=======
module.exports = { signup, login, updateProfile, changePassword, deleteAccount, requestPasswordReset, refreshToken, logout };
>>>>>>> feat/logout_api
=======
const refreshToken = await createRefreshToken(user.id);

res.json({
  accessToken,
  refreshToken: refreshToken.token
});

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

  const foundToken = await db.RefreshToken.findOne({ where: { token: refreshToken } });

  if (!foundToken) return res.status(403).json({ message: 'Invalid refresh token' });

  if (foundToken.expiryDate < new Date()) {
    await foundToken.destroy();
    return res.status(403).json({ message: 'Refresh token expired' });
  }

  const user = await db.User.findByPk(foundToken.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  res.json({ accessToken: newAccessToken });
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

  await db.RefreshToken.destroy({ where: { token: refreshToken } });

  res.json({ message: 'Logged out successfully' });
};

<<<<<<< HEAD
module.exports = { signup, login, updateProfile, changePassword, deleteAccount, refreshToken };
>>>>>>> feat/product
=======
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = new Date(expiry);
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.username},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json({ message: 'Password reset link sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (
      !user ||
      user.passwordResetToken !== token ||
      new Date() > user.passwordResetTokenExpiry
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, updateProfile, changePassword, deleteAccount, refreshToken, requestPasswordReset, resetPassword };
>>>>>>> feat/password-reset
