/**
 * @swagger
 * tags:
 *   - name: COINS
 *     description: Coin master data (name, symbol, image)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Coin:
 *       type: object
 *       properties:
 *         coinId:
 *           type: integer
 *           example: 1
 *         coinName:
 *           type: string
 *           example: Bitcoin
 *         coinSymbol:
 *           type: string
 *           example: BTC
 *         coinImage:
 *           type: string
 *           nullable: true
 *           example: https://example.com/btc.png
 */
/**
 * @swagger
 * /api/v1/coins:
 *   get:
 *     summary: Get all coins
 *     tags: [COINS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by coinName or coinSymbol
 *     responses:
 *       200:
 *         description: Coins fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Coin'
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
 * /api/v1/coins/detail/{coinId}:
 *   get:
 *     summary: Get coin detail
 *     tags: [COINS]
 *     parameters:
 *       - in: path
 *         name: coinId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Coin fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coin'
 *                 meta:
 *                   type: object
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/coins:
 *   post:
 *     summary: Create coin
 *     tags: [COINS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coinName
 *               - coinSymbol
 *             properties:
 *               coinName:
 *                 type: string
 *                 example: Bitcoin
 *               coinSymbol:
 *                 type: string
 *                 example: BTC
 *               coinImage:
 *                 type: string
 *                 example: https://example.com/btc.png
 *     responses:
 *       201:
 *         description: Coin created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/coins:
 *   patch:
 *     summary: Update coin
 *     tags: [COINS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coinId
 *             properties:
 *               coinId:
 *                 type: integer
 *                 example: 1
 *               coinName:
 *                 type: string
 *               coinSymbol:
 *                 type: string
 *               coinImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coin updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/coins/{coinId}:
 *   delete:
 *     summary: Delete coin
 *     tags: [COINS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coinId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Coin deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Internal server error
 */
