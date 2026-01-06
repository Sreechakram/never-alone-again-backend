'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // Each UserRole belongs to a User and to a Role
      UserRole.belongsTo(models.User, { foreignKey: 'userId' });
      UserRole.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }

  UserRole.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,   // IMPORTANT: same fix as User/OTP
        allowNull: false,
        unique: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'UserRole',
      tableName: 'UserRoles',  // make sure this matches your migration
      timestamps: true,
    }
  );

  return UserRole;
};
