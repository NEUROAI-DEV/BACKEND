/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('offices', {
      ...BaseModelFields,
      office_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      office_company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      office_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      office_address: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      office_longitude: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      office_latitude: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      office_maximum_distance_attendance: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1000
      },
      office_wifi_mac_address: {
        type: DataTypes.STRING(250),
        allowNull: true
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('offices')
  }
}
