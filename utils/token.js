const crypto = require('crypto');
const db = require('../models');

exports.createRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days

  return await db.RefreshToken.create({
    token,
    userId,
    expiryDate
  });
};
