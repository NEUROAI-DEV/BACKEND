/**
 * @swagger
 * tags:
 *   - name: MARKET
 *     description: Market data and AI-generated signals
 */

/**
 * @swagger
 * /api/v1/markets/top-signals:
 *   get:
 *     summary: Get top market signals (24h movers)
 *     tags: [MARKET]
 *     description: |
 *       Returns top gainers and losers based on 24-hour price change percentage
 *       from Binance USDT pairs.
 *       Data is cached for a short duration to improve performance.
 *     responses:
 *       200:
 *         description: Top market signals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gainers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                         example: SOLUSDT
 *                       changePercent:
 *                         type: number
 *                         example: 12.34
 *                 losers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                         example: DOGEUSDT
 *                       changePercent:
 *                         type: number
 *                         example: -8.21
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-01T01:10:00.000Z
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/markets/daily-summary:
 *   get:
 *     summary: Get daily AI market summary
 *     tags: [MARKET]
 *     description: |
 *       Returns an AI-generated daily market summary based on crypto news
 *       and sentiment analysis for the current day.
 *     responses:
 *       200:
 *         description: Daily market summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailySummaryId:
 *                   type: number
 *                   example: 12
 *                 dailySummaryDate:
 *                   type: string
 *                   format: date
 *                   example: 2026-02-01
 *                 dailySummaryMarketSentiment:
 *                   type: string
 *                   enum: [BULLISH, NEUTRAL, BEARISH]
 *                   example: BULLISH
 *                 dailySummaryConfidence:
 *                   type: number
 *                   example: 0.82
 *                 dailySummarySummary:
 *                   type: string
 *                 dailySummaryHighlights:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Daily summary not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/markets/ai-signals:
 *   get:
 *     summary: Get AI trading signals
 *     tags: [MARKET]
 *     description: |
 *       Returns AI-generated trading signals (bullish or bearish)
 *       based on market data, sentiment analysis, and trend detection.
 *     responses:
 *       200:
 *         description: AI signals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                         example: BTCUSDT
 *                       signal:
 *                         type: string
 *                         enum: [BULLISH, BEARISH, NEUTRAL]
 *                         example: BULLISH
 *                       confidence:
 *                         type: number
 *                         example: 0.76
 *                       reason:
 *                         type: string
 *                         example: Strong buying pressure and positive news sentiment
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-01T02:15:00.000Z
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/markets/predictions/live:
 *   get:
 *     summary: Get live AI price prediction by symbol and profile
 *     tags: [MARKET]
 *     description: |
 *       Returns AI-generated price prediction and trading levels
 *       based on selected trading profile.
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: TRXUSDT
 *         description: Trading pair symbol
 *       - in: query
 *         name: profile
 *         required: true
 *         schema:
 *           type: string
 *           enum: [SCALPING, SWING, INVEST]
 *           example: SCALPING
 *         description: Trading profile strategy
 *     responses:
 *       200:
 *         description: Live prediction generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   example: TRXUSDT
 *                 profile:
 *                   type: string
 *                   example: SCALPING
 *                 direction:
 *                   type: string
 *                   enum: [LONG, SHORT, WAIT]
 *                   example: LONG
 *                 entryZone:
 *                   type: object
 *                   properties:
 *                     buy:
 *                       type: number
 *                       example: 0.118
 *                     sell:
 *                       type: number
 *                       example: 0.124
 *                 stopLoss:
 *                   type: number
 *                   example: 0.115
 *                 confidence:
 *                   type: number
 *                   example: 0.81
 *                 reasoning:
 *                   type: string
 *                   example: Price holding support with increasing volume
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-02-01T02:30:00.000Z
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/markets/coins:
 *   get:
 *     summary: Get list of USDT crypto coins (symbols)
 *     tags: [MARKET]
 *     description: |
 *       Returns paginated list of trading pairs from Binance (USDT pairs only).
 *       Supports search by symbol or base asset (e.g. BTC, BTCUSDT) and pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: BTC
 *         description: Filter by symbol or base asset (case-insensitive)
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
 *     responses:
 *       200:
 *         description: List of coins retrieved successfully
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
 *                           symbol:
 *                             type: string
 *                             example: BTCUSDT
 *                           baseAsset:
 *                             type: string
 *                             example: BTC
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 500
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 20
 *                         totalPages:
 *                           type: integer
 *                           example: 25
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
