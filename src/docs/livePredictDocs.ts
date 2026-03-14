/**
 * @swagger
 * tags:
 *   - name: LIVE_PREDICTS
 *     description: Live predict – user symbol lists for live prediction
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     LivePredict:
 *       type: object
 *       properties:
 *         livePredictId:
 *           type: integer
 *           example: 1
 *         livePredictUserId:
 *           type: integer
 *           example: 1
 *         livePredictSymbols:
 *           type: string
 *           description: Comma-separated symbols or JSON array
 *           example: "btc,eth,sol"
 */
/**
 * @swagger
 * /api/v1/live-predicts:
 *   get:
 *     summary: Get all live predicts
 *     tags: [LIVE_PREDICTS]
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
 *         name: livePredictUserId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Live predicts fetched successfully
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
 *                         $ref: '#/components/schemas/LivePredict'
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
 * /api/v1/live-predicts/detail/{livePredictId}:
 *   get:
 *     summary: Get live predict detail
 *     tags: [LIVE_PREDICTS]
 *     parameters:
 *       - in: path
 *         name: livePredictId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID live predict
 *     responses:
 *       200:
 *         description: Live predict fetched successfully
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
 *                   $ref: '#/components/schemas/LivePredict'
 *                 meta:
 *                   type: object
 *       404:
 *         description: Live predict not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/live-predicts:
 *   post:
 *     summary: Create live predict
 *     tags: [LIVE_PREDICTS]
 *     description: livePredictUserId diambil dari JWT.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livePredictSymbols
 *             properties:
 *               livePredictSymbols:
 *                 type: string
 *                 example: "btc,eth,sol"
 *                 description: Comma-separated symbols
 *     responses:
 *       201:
 *         description: Live predict created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/live-predicts:
 *   patch:
 *     summary: Update live predict
 *     tags: [LIVE_PREDICTS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livePredictId
 *             properties:
 *               livePredictId:
 *                 type: integer
 *                 example: 1
 *               livePredictSymbols:
 *                 type: string
 *                 example: "btc,eth,sol,avax"
 *     responses:
 *       200:
 *         description: Live predict updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Live predict not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/live-predicts:
 *   delete:
 *     summary: Delete live predict
 *     tags: [LIVE_PREDICTS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livePredictId
 *             properties:
 *               livePredictId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Live predict deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Live predict not found
 *       500:
 *         description: Internal server error
 */
