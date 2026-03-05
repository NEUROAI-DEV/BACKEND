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

/**
 * @swagger
 * /api/v1/markets/coins/gecko:
 *   get:
 *     summary: Get list of coins (CoinGecko markets)
 *     tags: [MARKET]
 *     description: |
 *       Returns paginated list of coins from CoinGecko /coins/markets.
 *       Supports vs_currency, order, per_page, page, and optional search by name/symbol/id.
 *     parameters:
 *       - in: query
 *         name: vs_currency
 *         required: false
 *         schema:
 *           type: string
 *           default: usd
 *         description: Target currency
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [market_cap_desc, market_cap_asc, volume_desc, volume_asc, id_asc, id_desc]
 *           default: market_cap_desc
 *         description: Sort order
 *       - in: query
 *         name: per_page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 250
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: btc
 *         description: Search by coin name, symbol, or id (case-insensitive)
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
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/markets/trending-coins:
 *   get:
 *     summary: Get trending coins (merged)
 *     tags: [MARKET]
 *     description: |
 *       Returns trending coins merged from CoinGecko trending list and Dexscreener boosted tokens.
 *       Coins appearing in both sources are deduplicated by symbol; Dexscreener data is merged into the same item.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Optional max number of items to return (default returns all)
 *     responses:
 *       200:
 *         description: Trending coins retrieved successfully
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
 *                   example: Trending coins retrieved successfully.
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
 *                             nullable: true
 *                             description: CoinGecko id (if from CoinGecko)
 *                           name:
 *                             type: string
 *                             nullable: true
 *                           symbol:
 *                             type: string
 *                             nullable: true
 *                             example: BTC
 *                           marketCapRank:
 *                             type: number
 *                             nullable: true
 *                           thumb:
 *                             type: string
 *                             nullable: true
 *                             description: Thumbnail image URL
 *                           chainId:
 *                             type: string
 *                             nullable: true
 *                             description: Chain id (Dexscreener)
 *                           tokenAddress:
 *                             type: string
 *                             nullable: true
 *                             description: Token contract address (Dexscreener)
 *                           boostAmount:
 *                             type: number
 *                             description: Dexscreener boost amount
 *                           totalBoost:
 *                             type: number
 *                             description: Dexscreener total boost
 *                           url:
 *                             type: string
 *                             nullable: true
 *                             description: Dexscreener URL
 *                           sources:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["coingecko", "dexscreener"]
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid query parameters (e.g. limit out of range)
 *       500:
 *         description: Internal server error
 */
