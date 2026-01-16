/**
 * @swagger
 * /api/v1/administrators/subscriptions:
 *   get:
 *     summary: Get All Subscription
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: subscription detail
 *       404:
 *         description: subscription not found
 *
 *   patch:
 *     summary: Update a subscription
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *             properties:
 *               subscriptionId:
 *                 type: integer
 *                 example: 1
 *               subscriptionPlanName:
 *                 type: string
 *                 example: "Pro Plan"
 *               subscriptionPriceMonthly:
 *                 type: number
 *                 example: 29.99
 *               subscriptionMaxUsers:
 *                 type: integer
 *                 example: 10
 *               subscriptionMaxOffices:
 *                 type: integer
 *                 example: 3
 *               subscriptionStatus:
 *                 type: string
 *                 enum: [active, inactive, cancelled]
 *                 example: active
 *               subscriptionStartDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *               subscriptionEndDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               subscriptionNextBillingDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               subscriptionBillingCycle:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 example: monthly
 *     responses:
 *       200:
 *         description: subscription updated
 *       400:
 *         description: invalid request data
 *       404:
 *         description: subscription not found
 */

/**
 * @swagger
 * /api/v1/administrators/transactions/:
 *   get:
 *     summary: Get all transactions administeators
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of transactions
 */

/**
 * @swagger
 * /api/v1/administrators/transactions:
 *   patch:
 *     summary: Update a transactions
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: integer
 *                 example: 1
 *               transactionBillingPlanId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - transactionId
 *               - transactionBillingPlanId
 *     responses:
 *       200:
 *         description: transaction updated
 *       400:
 *         description: invalid request data
 *       404:
 *         description: transaction not found
 */
