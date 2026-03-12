/**
 * @swagger
 * tags:
 *   - name: TRANSACTIONS
 *     description: Transaction records for subscriptions and payments
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: integer
 *           example: 1
 *         transactionUserId:
 *           type: integer
 *           example: 1
 *         transactionSubscriptionId:
 *           type: integer
 *           nullable: true
 *           example: 10
 *         transactionAmount:
 *           type: number
 *           format: float
 *           example: 9.99
 *         transactionStatus:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, REFUNDED]
 *         transactionProvider:
 *           type: string
 *           example: STRIPE
 *         transactionExternalId:
 *           type: string
 *           example: ch_123456789
 *         transactionErrorMessage:
 *           type: string
 *           nullable: true
 *         transactionPaidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
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
 *       - in: query
 *         name: transactionUserId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by user ID
 *       - in: query
 *         name: transactionStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, REFUNDED]
 *         required: false
 *         description: Filter by transaction status
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
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
 *                         $ref: '#/components/schemas/Transaction'
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/transactions/detail/{transactionId}:
 *   get:
 *     summary: Get transaction detail
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID transaction
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Create transaction
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionUserId
 *               - transactionAmount
 *             properties:
 *               transactionUserId:
 *                 type: integer
 *                 example: 1
 *               transactionSubscriptionId:
 *                 type: integer
 *                 nullable: true
 *               transactionAmount:
 *                 type: number
 *                 format: float
 *                 example: 9.99
 *               transactionStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, FAILED, REFUNDED]
 *                 example: PENDING
 *               transactionProvider:
 *                 type: string
 *                 example: STRIPE
 *               transactionExternalId:
 *                 type: string
 *                 example: ch_123456789
 *               transactionErrorMessage:
 *                 type: string
 *               transactionPaidAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/transactions:
 *   patch:
 *     summary: Update transaction
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: integer
 *                 example: 1
 *               transactionAmount:
 *                 type: number
 *               transactionStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, FAILED, REFUNDED]
 *               transactionProvider:
 *                 type: string
 *               transactionExternalId:
 *                 type: string
 *               transactionErrorMessage:
 *                 type: string
 *               transactionPaidAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/transactions:
 *   delete:
 *     summary: Delete transaction
 *     tags: [TRANSACTIONS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
