'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Chat.belongsTo(models.Bot, { foreignKey: 'botId', as: 'bot' });
      Chat.hasMany(models.Message, { foreignKey: 'chatId', as: 'messages' });
    }
  }

  Chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'User ID must be an integer',
          },
        },
      },
      botId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Bot ID must be an integer',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      timestamps: true,
    }
  );

  return Chat;
};
