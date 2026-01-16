/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.bulkInsert(
      'billing_plans',
      [
        {
          billing_plan_name: 'Trial',
          billing_plan_category: 'trial',
          billing_plan_price_per_user: 0,
          billing_plan_duration_month: 1,
          billing_plan_discount_percentage: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          billing_plan_name: 'Small',
          billing_plan_category: 'subscription',
          billing_plan_price_per_user: 7000,
          billing_plan_duration_month: 3,
          billing_plan_discount_percentage: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          billing_plan_name: 'Medium',
          billing_plan_category: 'subscription',
          billing_plan_price_per_user: 6500,
          billing_plan_duration_month: 6,
          billing_plan_discount_percentage: 20,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          billing_plan_name: 'Large',
          billing_plan_category: 'subscription',
          billing_plan_price_per_user: 4500,
          billing_plan_duration_month: 12,
          billing_plan_discount_percentage: 15,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.bulkDelete('billing_plans', null, {})
  }
}
