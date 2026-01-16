/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('schedules', {
      ...BaseModelFields,
      schedule_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      schedule_company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      schedule_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      schedule_office_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'offices',
          key: 'office_id'
        }
      },
      schedule_start: {
        type: DataTypes.STRING,
        allowNull: true
      },
      schedule_end: {
        type: DataTypes.STRING,
        allowNull: true
      },
      schedule_category: {
        type: DataTypes.ENUM('regular', 'libur'),
        allowNull: true,
        defaultValue: 'regular'
      },
      schedule_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('schedules')
  }
}
