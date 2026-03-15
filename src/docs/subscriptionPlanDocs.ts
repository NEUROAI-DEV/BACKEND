/**
 * @swagger
 * tags:
 *   - name: SUBSCRIPTION_PLANS
 *     description: Master data subscription plans
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         subscriptionPlanId:
 *           type: integer
 *           example: 1
 *         subscriptionPlanName:
 *           type: string
 *           example: PRO
 *         subscriptionPlanOrder:
 *           type: integer
 *           example: 1
 *         subscriptionPlanDescription:
 *           type: string
 *           example: Paket langganan PRO bulanan
 *         subscriptionPlanPriceMonthly:
 *           type: number
 *           format: float
 *           example: 9.99
 *         subscriptionPlanPriceYearly:
 *           type: number
 *           format: float
 *           example: 99.99
 *         subscriptionPlanInterval:
 *           type: string
 *           enum: [MONTHLY, YEARLY]
 *         subscriptionPlanCategory:
 *           type: string
 *           enum: [FREE, PRO, PREMIUM]
 */
/**
 * @swagger
 * /api/v1/subscription-plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [SUBSCRIPTION_PLANS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Halaman (pagination)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Subscription plans fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SubscriptionPlan'
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 meta:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/subscription-plans/detail/{subscriptionPlanId}:
 *   get:
 *     summary: Get subscription plan detail
 *     tags: [SUBSCRIPTION_PLANS]
 *     parameters:
 *       - in: path
 *         name: subscriptionPlanId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID subscription plan
 *     responses:
 *       200:
 *         description: Subscription plan fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SubscriptionPlan'
 *                 meta:
 *                   type: object
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/subscription-plans:
 *   post:
 *     summary: Create subscription plan
 *     tags: [SUBSCRIPTION_PLANS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionPlanName
 *               - subscriptionPlanOrder
 *               - subscriptionPlanPriceMonthly
 *             properties:
 *               subscriptionPlanName:
 *                 type: string
 *                 example: PRO
 *               subscriptionPlanOrder:
 *                 type: integer
 *                 example: 1
 *               subscriptionPlanDescription:
 *                 type: string
 *                 example: Paket langganan PRO bulanan
 *               subscriptionPlanPriceMonthly:
 *                 type: number
 *                 format: float
 *                 example: 9.99
 *               subscriptionPlanPriceYearly:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               subscriptionPlanInterval:
 *                 type: string
 *                 enum: [MONTHLY, YEARLY]
 *                 example: MONTHLY
 *               subscriptionPlanCategory:
 *                 type: string
 *                 enum: [FREE, PRO, PREMIUM]
 *                 example: PRO
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *       400:
 *         description: Validation error or subscriptionPlanOrder already used
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/subscription-plans:
 *   patch:
 *     summary: Update subscription plan
 *     tags: [SUBSCRIPTION_PLANS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionPlanId
 *             properties:
 *               subscriptionPlanId:
 *                 type: integer
 *                 example: 1
 *               subscriptionPlanName:
 *                 type: string
 *                 example: PRO+
 *               subscriptionPlanOrder:
 *                 type: integer
 *               subscriptionPlanDescription:
 *                 type: string
 *               subscriptionPlanPriceMonthly:
 *                 type: number
 *               subscriptionPlanPriceYearly:
 *                 type: number
 *               subscriptionPlanInterval:
 *                 type: string
 *                 enum: [MONTHLY, YEARLY]
 *               subscriptionPlanCategory:
 *                 type: string
 *                 enum: [FREE, PRO, PREMIUM]
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       400:
 *         description: Validation error or subscriptionPlanOrder already used
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/subscription-plans:
 *   delete:
 *     summary: Delete subscription plan
 *     tags: [SUBSCRIPTION_PLANS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionPlanId
 *             properties:
 *               subscriptionPlanId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
