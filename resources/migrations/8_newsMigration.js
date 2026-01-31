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
        type: DataTypes.STRING(250),
        allowNull: true
      },
      news_slug: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      news_title: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      news_description: {
        type: DataTypes.TEXT
      },
      news_published_at: {
        type: DataTypes.STRING,
        allowNull: true
      },
      news_created_at: {
        type: DataTypes.STRING,
        allowNull: true
      },
      news_kind: {
        type: DataTypes.STRING,
        allowNull: true
      },
      news_sentiment_confidence: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      news_sentiment: {
        type: DataTypes.ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL'),
        allowNull: true
      },
      news_sentiment_reason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('news')
  }
}
