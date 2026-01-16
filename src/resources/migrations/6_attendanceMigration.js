/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('attendances', {
      ...BaseModelFields,
      attendance_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      attendance_company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      attendance_schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attendance_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attendance_office_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attendance_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      // 'work_start',
      // 'work_end',
      // 'break_start',
      // 'break_end',
      // 'overtime_start',
      // 'overtime_end'
      attendance_category: {
        type: DataTypes.ENUM(
          'checkin',
          'checkout',
          'breakin',
          'breakout',
          'otin',
          'otout'
        ),
        allowNull: false
      },
      attendance_photo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      attendance_latitude: {
        type: DataTypes.STRING,
        allowNull: true
      },
      attendance_longitude: {
        type: DataTypes.STRING,
        allowNull: true
      },
      attendance_distance_from_office: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('attendances')
  }
}
