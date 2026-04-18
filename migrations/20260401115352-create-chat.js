'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      botId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Chats', ['uuid'], {
      unique: true,
      name: 'chats_uuid_unique'
    });
    await queryInterface.addIndex('Chats', ['userId'], {
      name: 'chats_user_id_index'
    });
    await queryInterface.addIndex('Chats', ['botId'], {
      name: 'chats_bot_id_index'
    });
    await queryInterface.addIndex('Chats', ['userId', 'botId'], {
      name: 'chats_user_bot_index'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};
