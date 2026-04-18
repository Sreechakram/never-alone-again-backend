"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "roleId" });
      User.hasMany(models.Chat, { foreignKey: "userId", as: "chats" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      userName: {
        type: DataTypes.STRING(30),
        allowNull: true,
        validate: {
          len: [3, 30],
        },
      },

      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Please enter a valid email address",
          },
          len: {
            args: [5, 254],
            msg: "Email length is invalid",
          },
        },
      },

      phoneNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [8, 15],
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 64],
        },
      },

      city: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: [2, 50],
        },
      },

      state: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: [2, 50],
        },
      },

      country: {
        type: DataTypes.STRING(56),
        allowNull: true,
        validate: {
          len: [2, 56],
        },
      },

      zipcode: {
        type: DataTypes.STRING(12),
        allowNull: true,
        validate: {
          len: [3, 12],
        },
      },

      address: {
        type: DataTypes.STRING(120),
        allowNull: true,
        validate: {
          len: [5, 120],
        },
      },

      socialLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      LoginType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "email",
        validate: {
          len: [3, 20],
        },
      },

      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      paranoid: true,

      hooks: {
        beforeCreate: async (user) => {
          if (user.email) {
            user.email = user.email.trim().toLowerCase();
          }

          if (user.password) {
            const bcrypt = require("bcryptjs");
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("email") && user.email) {
            user.email = user.email.trim().toLowerCase();
          }

          if (user.changed("password") && user.password) {
            const bcrypt = require("bcryptjs");
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
