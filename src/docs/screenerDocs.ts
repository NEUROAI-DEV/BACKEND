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
 *       Create a new screener for the authenticated user (fitur premium).
 *       Memerlukan subscription aktif (free trial 30 hari atau langganan bulanan).
 *       screenerUserId diambil dari JWT. Maksimal 10 screener per user; mengembalikan 400 jika sudah 10.
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
 *       403:
 *         description: Subscription required - aktifkan free trial atau langganan bulanan terlebih dahulu
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
 *       Mengembalikan daftar screener user dengan pagination dan pencarian (fitur premium).
 *       Memerlukan subscription aktif (free trial 30 hari atau langganan bulanan).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: page
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
 *       403:
 *         description: Subscription required - aktifkan free trial atau langganan bulanan terlebih dahulu
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/screeners/top-averages:
 *   get:
 *     summary: Get top movers (gainers or losers)
 *     tags: [SCREENER]
 *     description: |
 *       Mengembalikan daftar koin top gainers atau top losers berdasarkan persentase perubahan harga (CoinGecko getTopMovers).
 *       Mendukung filter volume & likuiditas minimum serta periode perubahan (1h, 24h, 7d, 14d, 30d).
 *       Memerlukan JWT dan subscription aktif.
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
 *         description: Mata uang (vs_currency)
 *       - in: query
 *         name: direction
 *         required: false
 *         schema:
 *           type: string
 *           enum: [gainers, losers]
 *           default: gainers
 *         description: gainers = kenaikan tertinggi, losers = penurunan tertinggi
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman (1-based)
 *       - in: query
 *         name: minVolume
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *         description: Volume minimum (filter)
 *       - in: query
 *         name: minLiquidity
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *         description: Likuiditas minimum / market cap minimum (filter)
 *       - in: query
 *         name: price_change_percentage
 *         required: false
 *         schema:
 *           type: string
 *           enum: ['1h', '24h', '7d', '14d', '30d']
 *           default: '24h'
 *         description: Periode perubahan harga
 *     responses:
 *       200:
 *         description: Top averages (gainers/losers) retrieved successfully
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
 *                   example: Top averages (gainers/losers) retrieved successfully.
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
 *                           name:
 *                             type: string
 *                             example: Bitcoin
 *                           symbol:
 *                             type: string
 *                             example: BTC
 *                           image:
 *                             type: string
 *                             nullable: true
 *                           price:
 *                             type: number
 *                             example: 43250.5
 *                           priceChange24h:
 *                             type: number
 *                             example: 5.2
 *                           marketCap:
 *                             type: number
 *                           marketCapRank:
 *                             type: number
 *                             nullable: true
 *                           volume24h:
 *                             type: number
 *                           high24h:
 *                             type: number
 *                           low24h:
 *                             type: number
 *                           sources:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["coingecko"]
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     size:
 *                       type: integer
 *                       example: 10
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Subscription required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/screeners/{screenerId}:
 *   delete:
 *     summary: Delete screener
 *     tags: [SCREENER]
 *     description: |
 *       Hapus screener by ID (fitur premium). Hanya pemilik yang bisa menghapus. Memerlukan subscription aktif.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: screenerId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Screener ID to delete
 *     responses:
 *       200:
 *         description: Screener deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Screener deleted successfully
 *                 data:
 *                   type: object
 *                   nullable: true
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Subscription required - aktifkan free trial atau langganan bulanan terlebih dahulu
 *       404:
 *         description: Screener not found (or not owned by user)
 *       500:
 *         description: Internal server error
 */
