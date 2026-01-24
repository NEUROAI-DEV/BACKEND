/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('news', {
      ...BaseModelFields,
      news_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      news_external_id: {
        type: DataTypes.STRING(100),
        unique: true
      },
      news_slug: {
        type: DataTypes.STRING(250),
        unique: true
      },
      news_title: {
        type: DataTypes.STRING(250),
        unique: true
      },
      news_description: {
        type: DataTypes.TEXT,
        unique: true
      },
      news_published_at: {
        type: DataTypes.STRING,
        unique: true
      },
      news_created_at: {
        type: DataTypes.STRING,
        unique: true
      },
      kind: {
        type: DataTypes.STRING,
        unique: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('news')
  }
}
