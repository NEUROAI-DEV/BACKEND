/**
 * @swagger
 * tags:
 *   - name: WATCHLIST
 *     description: Watchlist - fetch coin data by IDs (CoinGecko)
 */

/**
 * @swagger
 * /api/v1/watchlist:
 *   get:
 *     summary: Get my watchlist (coin data from DB)
 *     tags: [WATCHLIST]
 *     description: |
 *       Mengembalikan data market untuk koin-koin di watchlist user yang login.
 *       watchListUserId diambil dari JWT; coin IDs diambil dari database (watchlist user), bukan dari query.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vs_currency
 *         required: false
 *         schema:
 *           type: string
 *           default: usd
 *           maxLength: 10
 *         description: Mata uang harga (vs_currency)
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Watchlist retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: bitcoin
 *                           symbol:
 *                             type: string
 *                             example: btc
 *                           name:
 *                             type: string
 *                             example: Bitcoin
 *                           image:
 *                             type: string
 *                             description: URL to coin image
 *                           current_price:
 *                             type: number
 *                             nullable: true
 *                           market_cap:
 *                             type: number
 *                             nullable: true
 *                           market_cap_rank:
 *                             type: number
 *                             nullable: true
 *                           price_change_percentage_24h:
 *                             type: number
 *                             nullable: true
 *                           total_volume:
 *                             type: number
 *                             nullable: true
 *                           high_24h:
 *                             type: number
 *                             nullable: true
 *                           low_24h:
 *                             type: number
 *                             nullable: true
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/watchlist:
 *   post:
 *     summary: Create watchlist
 *     tags: [WATCHLIST]
 *     description: |
 *       Membuat watchlist baru untuk user yang login. watchListUserId diambil dari JWT.
 *       watchListCoinIds selalu dalam bentuk string comma-separated (e.g. bitcoin,ethereum,solana,pepe). Disimpan unik (duplikat otomatis dihapus).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - watchListCoinIds
 *             properties:
 *               watchListCoinIds:
 *                 type: string
 *                 example: "bitcoin,ethereum,solana,pepe"
 *                 description: Coin IDs comma-separated (string)
 *     responses:
 *       201:
 *         description: Watchlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Watchlist created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     watchListId:
 *                       type: integer
 *                       example: 1
 *                     watchListUserId:
 *                       type: integer
 *                       example: 1
 *                     watchListCoinIds:
 *                       type: string
 *                       example: "bitcoin,ethereum,solana,pepe"
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid body (validation error)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/watchlist/{watchListCoinId}:
 *   delete:
 *     summary: Delete watchlist
 *     tags: [WATCHLIST]
 *     description: Soft delete watchlist by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: watchListCoinId
 *         required: true
 *         schema:
 *           type: string
 *           example: "bitcoin"
 *         description: Coin ID to delete
 *     responses:
 *       200:
 *         description: Watchlist deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Watchlist deleted successfully.
 *                 data:
 *                   type: object
 *                   nullable: true
 *                 meta:
 *                   type: object
 *       404:
 *         description: Watchlist not found
 *       500:
 *         description: Internal server error
 */
