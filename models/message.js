'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: 'chatId', as: 'chat' });
    }
  }

  Message.init(
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
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Chat ID must be an integer',
          },
        },
      },
      senderType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Sender type is required',
          },
          isIn: {
            args: [['user', 'bot', 'system']],
            msg: 'Sender type must be user, bot, or system',
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Message content is required',
          },
          len: {
            args: [1, 10000],
            msg: 'Message content must be between 1 and 10000 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Message',
      timestamps: true,
      hooks: {
        beforeValidate: (message) => {
          if (typeof message.senderType === 'string') {
            message.senderType = message.senderType.trim().toLowerCase();
          }
        },
      },
    }
  );

  return Message;
};
