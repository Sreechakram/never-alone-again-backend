'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bot extends Model {
    static associate(models) {
      Bot.belongsTo(models.User, { foreignKey: 'userId', as: 'creator' });
      Bot.hasMany(models.Chat, { foreignKey: 'botId', as: 'chats' });
    }
  }

  Bot.init(
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
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Bot name is required',
          },
          len: {
            args: [2, 80],
            msg: 'Bot name must be between 2 and 80 characters',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 2000],
            msg: 'Description must be less than 2000 characters',
          },
        },
      },
      system_prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'System prompt is required',
          },
          len: {
            args: [10, 10000],
            msg: 'System prompt must be between 10 and 10000 characters',
          },
        },
      },
      model: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Model is required',
          },
          len: {
            args: [2, 100],
            msg: 'Model must be between 2 and 100 characters',
          },
        },
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Provider is required',
          },
          len: {
            args: [2, 50],
            msg: 'Provider must be between 2 and 50 characters',
          },
        },
      },
      type: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Bot type is required',
          },
          len: {
            args: [2, 30],
            msg: 'Bot type must be between 2 and 30 characters',
          },
        },
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
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Bot',
      timestamps: true,
      hooks: {
        beforeValidate: (bot) => {
          ['name', 'model', 'provider', 'type'].forEach((field) => {
            if (typeof bot[field] === 'string') {
              bot[field] = bot[field].trim();
            }
          });
        },
      },
    }
  );

  return Bot;
};
