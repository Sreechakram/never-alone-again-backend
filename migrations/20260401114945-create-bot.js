'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bots', {
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
      name: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      system_prompt: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(30),
        allowNull: false
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
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    await queryInterface.addIndex('Bots', ['uuid'], {
      unique: true,
      name: 'bots_uuid_unique'
    });
    await queryInterface.addIndex('Bots', ['provider'], {
      name: 'bots_provider_index'
    });
    await queryInterface.addIndex('Bots', ['userId'], {
      name: 'bots_user_id_index'
    });
    await queryInterface.addIndex('Bots', ['isActive'], {
      name: 'bots_is_active_index'
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE Bots
      ADD CONSTRAINT bots_description_length_check
      CHECK (description IS NULL OR CHAR_LENGTH(description) <= 2000)
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE Bots
      ADD CONSTRAINT bots_system_prompt_length_check
      CHECK (CHAR_LENGTH(system_prompt) BETWEEN 10 AND 10000)
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bots');
  }
};
