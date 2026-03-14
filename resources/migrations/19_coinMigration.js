/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('coins', {
      ...BaseModelFields,
      coin_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      coin_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      coin_symbol: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      coin_image: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('coins')
  }
}
