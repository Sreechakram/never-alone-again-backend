'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }

  User.init({
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
    userName: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true      
    },
    phoneNo:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipcode:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    address:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false   
    },
    LoginType: {
      type: DataTypes.STRING,
      allowNull: true   
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true   
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
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  });

  return User;
};
