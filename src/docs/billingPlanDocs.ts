/**
 * @swagger
 * components:
 *   schemas:
 *     IBillingPlanCreateRequest:
 *       type: object
 *       properties:
 *         billingPlanName:
 *           type: string
 *           example: "Basic Plan"
 *         billingPlanCategory:
 *           type: string
 *           enum: [trial, subscription, custom]
 *           example: "subscription"
 *         billingPlanPriceMonthly:
 *           type: number
 *           example: 99000
 *         billingPlanMaxUsers:
 *           type: integer
 *           example: 10
 *         billingPlanMaxOffices:
 *           type: integer
 *           example: 5
 *       required:
 *         - billingPlanName
 *         - billingPlanCategory
 *         - billingPlanPriceMonthly
 *         - billingPlanMaxUsers
 *         - billingPlanMaxOffices
 *
 *     IBillingPlanUpdateRequest:
 *       type: object
 *       properties:
 *         billingPlanId:
 *           type: number
 *           example: 1
 *         billingPlanName:
 *           type: string
 *           nullable: true
 *           example: "Pro Plan"
 *         billingPlanCategory:
 *           type: string
 *           enum: [trial, subscription, custom]
 *           example: "custom"
 *         billingPlanPriceMonthly:
 *           type: number
 *           nullable: true
 *           example: 199000
 *         billingPlanMaxUsers:
 *           type: number
 *           nullable: true
 *           example: 50
 *         billingPlanMaxOffices:
 *           type: number
 *           nullable: true
 *           example: 20
 *       required:
 *         - billingPlanId
 *         - billingPlanCategory
 */

/**
 * @swagger
 * /api/v1/administrators/billing-plans:
 *   post:
 *     summary: Create a new billing plan
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IBillingPlanCreateRequest'
 *     responses:
 *       201:
 *         description: Billing plan created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/administrators/billing-plans:
 *   patch:
 *     summary: Update a billing plan
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IBillingPlanUpdateRequest'
 *     responses:
 *       200:
 *         description: Billing plan updated successfully
 *       404:
 *         description: Billing plan not found
 */

/**
 * @swagger
 * /api/v1/administrators/billing-plans:
 *   get:
 *     summary: Get all billing plans
 *     tags: [ADMINISTRATORS]
 *     security:
 *       - BearerAuth: []
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
 *         description: List of billing plans
 */
