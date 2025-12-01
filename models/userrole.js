'use strict';
const { v4: uuidv4 } = require('uuid'); // Import uuidv4

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(), // Set uuidv4 as the default value
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Still required, but no foreign key reference
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Enable soft delete (deletedAt)
    tableName: 'UserRoles'
  });

  UserRole.associate = (models) => {
    // Associate UserRole with User
    UserRole.belongsTo(models.User, {
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return UserRole;
};
