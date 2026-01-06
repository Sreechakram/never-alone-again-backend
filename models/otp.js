'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {
      // No explicit associations needed here if not defining additional relationships
    }
  }
  
  OTP.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'OTP',
    timestamps: true, // Ensure automatic timestamp management
    paranoid: true // Enable soft deletes (uses deletedAt)
  });

  return OTP;
};
