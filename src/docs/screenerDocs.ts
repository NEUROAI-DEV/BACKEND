/**
 * @swagger
 * tags:
 *   - name: SCREENER
 *     description: User screener (coin + profile) create and list
 */

/**
 * @swagger
 * /api/v1/screeners:
 *   post:
 *     summary: Create screener
 *     tags: [SCREENER]
 *     description: |
 *       Create a new screener for the authenticated user.
 *       screenerUserId is set from JWT (req.jwtPayload.userId).
 *       Maximum 10 screeners per user; returns 400 if user already has 10.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - screenerCoinSymbol
 *               - screenerProfile
 *             properties:
 *               screenerCoinSymbol:
 *                 type: string
 *                 maxLength: 100
 *                 example: BTCUSDT
 *                 description: Coin symbol (e.g. BTCUSDT)
 *               screenerProfile:
 *                 type: string
 *                 enum: [SCALPING, SWING, INVEST]
 *                 example: SCALPING
 *                 description: Trading profile
 *     responses:
 *       201:
 *         description: Screener created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Screener created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     screenerId:
 *                       type: integer
 *                       example: 1
 *                     screenerUserId:
 *                       type: integer
 *                       example: 1
 *                     screenerCoinSymbol:
 *                       type: string
 *                       example: BTCUSDT
 *                     screenerProfile:
 *                       type: string
 *                       enum: [SCALPING, SWING, INVEST]
 *                       example: SCALPING
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (validation error or maximum 10 screeners per user)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/screeners:
 *   get:
 *     summary: List screeners (paginated, search)
 *     tags: [SCREENER]
 *     description: |
 *       Returns screeners for the authenticated user with pagination and optional search by coin symbol.
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
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search by screener coin symbol (partial match)
 *     responses:
 *       200:
 *         description: List of screeners retrieved successfully
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
 *                           screenerId:
 *                             type: integer
 *                             example: 1
 *                           screenerUserId:
 *                             type: integer
 *                             example: 1
 *                           screenerCoinSymbol:
 *                             type: string
 *                             example: BTCUSDT
 *                           screenerProfile:
 *                             type: string
 *                             enum: [SCALPING, SWING, INVEST]
 *                             example: SCALPING
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 5
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
