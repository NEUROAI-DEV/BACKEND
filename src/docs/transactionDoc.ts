/**
 * @swagger
 * components:
 *   schemas:
 *     ICreateTransactionRequest:
 *       type: object
 *       properties:
 *         transactionBillingPlanId:
 *           type: number
 *           example: 1
 *         transactionTotalMonth:
 *           type: number
 *           example: 1
 *         transactionTotalDiscount:
 *           type: number
 *           example: 1
 *         transactionTotalUsers:
 *           type: number
 *           example: 1
 *         transactionTotalAmount:
 *           type: number
 *           example: 1
 *         transactionDescription:
 *           type: string
 *           example: "helo world"
 *       required:
 *         - transactionBillingPlanId
 *         - transactionTotalMonth
 *         - transactionTotalDiscount
 *         - transactionTotalUsers
 *         - transactionTotalAmount
 *         - transactionDescription
 *     ICompanyFindAllRequest:
 *       type: object
 *       properties:
 *         jwtPayload:
 *           $ref: '#/components/schemas/IJwtPayload'
 *         page:
 *           type: number
 *           example: 1
 *         size:
 *           type: number
 *           example: 10
 *         search:
 *           type: string
 *           example: "satuflow"
 *         pagination:
 *           type: boolean
 *           example: true
 *       required:
 *         - jwtPayload
 */

/**
 * @swagger
 * /api/v1/transactions/:
 *   post:
 *     summary: Create a new transaction
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID fortenant contex (multi-tenant)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICreateTransactionRequest'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/transactions/:
 *   get:
 *     summary: Get all transactions
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
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
