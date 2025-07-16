'use strict';
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    expiryDate: DataTypes.DATE
  }, {});
  
  RefreshToken.associate = function(models) {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return RefreshToken;
};
