/**
 * @swagger
 * tags:
 *   - name: MARKET
 *     description: Market data and AI-generated signals
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
