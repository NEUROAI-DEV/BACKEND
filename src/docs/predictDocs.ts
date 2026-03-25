/**
 * @swagger
 * tags:
 *   - name: PREDICTS
 *     description: Prediction endpoints
 */

/**
 * @swagger
 * /api/v1/predicts:
 *   get:
 *     summary: Get all predicts (current user)
 *     tags: [PREDICTS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: string
 *           example: "true"
 *       - in: query
 *         name: predictSymbol
 *         schema:
 *           type: string
 *           example: BTC
 *       - in: query
 *         name: predictType
 *         schema:
 *           type: string
 *           enum: [SCALPING, SWING, INVESTING]
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/predicts/run:
 *   post:
 *     summary: Run prediction for a symbol
 *     tags: [PREDICTS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, symbol]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [SCALPING, SWING, INVESTING]
 *                 example: SWING
 *               symbol:
 *                 type: string
 *                 example: BTCUSDT
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/predicts/{predictId}:
 *   delete:
 *     summary: Remove a predict by id (current user)
 *     tags: [PREDICTS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: predictId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
