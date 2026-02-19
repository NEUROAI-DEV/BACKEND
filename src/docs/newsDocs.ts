/**
 * @swagger
 * tags:
 *   name: NEWS
 *   description: News management
 */

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Get all news
 *     description: Fetch list of news
 *     tags: [NEWS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number (starting from 0)
 *         example: 0
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: Number of records per page
 *         example: 10
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: boolean
 *         description: Enable pagination
 *         example: true
 *     responses:
 *       200:
 *         description: news fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/news/detail/{newsId}:
 *   get:
 *     summary: Get news detail by ID
 *     description: Fetch a single news by newsId
 *     tags: [NEWS]
 *     parameters:
 *       - in: path
 *         name: newsId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: News ID
 *     responses:
 *       200:
 *         description: News detail fetched successfully
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
 *                     newsId:
 *                       type: integer
 *                       example: 1
 *                     newsExternalId:
 *                       type: string
 *                     newsSlug:
 *                       type: string
 *                     newsTitle:
 *                       type: string
 *                     newsDescription:
 *                       type: string
 *                     newsPublishedAt:
 *                       type: string
 *                       format: date-time
 *                     newsCreatedAt:
 *                       type: string
 *                       format: date-time
 *                     newsKind:
 *                       type: string
 *                     newsSentiment:
 *                       type: string
 *                       enum: [POSITIVE, NEGATIVE, NEUTRAL]
 *                     newsSentimentConfidence:
 *                       type: number
 *                     newsSentimentReason:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 meta:
 *                   type: object
 *       404:
 *         description: News not found
 *       500:
 *         description: Internal server error
 */
