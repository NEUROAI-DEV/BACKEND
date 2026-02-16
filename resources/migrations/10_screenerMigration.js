/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('screeners', {
      ...BaseModelFields,

      screener_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      screener_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },

      screener_coin_symbol: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      screener_coin_image: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      screener_profile: {
        type: DataTypes.ENUM('SCALPING', 'SWING', 'INVEST'),
        allowNull: false,
        defaultValue: 'SCALPING'
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('screeners')
  }
}
