/**
 * @swagger
 * tags:
 *   - name: LOGS
 *     description: Backend logs (errors and important info) for frontend display
 */

/**
 * @swagger
 * /api/v1/logs:
 *   post:
 *     summary: Create a log entry
 *     tags: [LOGS]
 *     description: |
 *       Manually create a log entry (error, warn, or info).
 *       Requires authentication (Bearer token).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - logLevel
 *               - logMessage
 *             properties:
 *               logLevel:
 *                 type: string
 *                 enum: [error, warn, info]
 *                 example: error
 *               logMessage:
 *                 type: string
 *                 example: Something went wrong in payment flow
 *               logSource:
 *                 type: string
 *                 maxLength: 255
 *                 example: PaymentService
 *                 description: Optional source/category of the log
 *               logMeta:
 *                 type: string
 *                 description: Optional JSON string or extra details (e.g. stack trace)
 *     responses:
 *       201:
 *         description: Log created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     summary: Get all logs (for frontend display)
 *     tags: [LOGS]
 *     description: |
 *       Returns paginated list of logs. Filter by level and search in message/source.
 *       Requires authentication (Bearer token).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: level
 *         required: false
 *         schema:
 *           type: string
 *           enum: [error, warn, info]
 *         description: Filter by log level
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search in log message or source (partial match)
 *     responses:
 *       200:
 *         description: List of logs retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           logId:
 *                             type: integer
 *                           logLevel:
 *                             type: string
 *                             enum: [error, warn, info]
 *                           logMessage:
 *                             type: string
 *                           logSource:
 *                             type: string
 *                             nullable: true
 *                           logMeta:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     totalItems:
 *                       type: integer
 *                     currentPage:
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
