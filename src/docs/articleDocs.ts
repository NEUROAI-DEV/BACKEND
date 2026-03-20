/**
 * @swagger
 * tags:
 *   name: ARTICLES
 *   description: Article management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         articleId:
 *           type: number
 *           example: 1
 *         articleTitle:
 *           type: string
 *           example: Smart Money Explained
 *         articleDescription:
 *           type: string
 *           example: Deep dive into smart money behavior in crypto market
 *         articleImage:
 *           type: string
 *           example: https://example.com/image.jpg
 */

/**
 * @swagger
 * /api/v1/articles:
 *   post:
 *     summary: Create new article
 *     description: Create a new article
 *     tags: [ARTICLES]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articleTitle
 *               - articleDescription
 *             properties:
 *               articleTitle:
 *                 type: string
 *                 example: Understanding Smart Money
 *               articleDescription:
 *                 type: string
 *                 example: This article explains smart money concept in crypto.
 *               articleImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: Get all articles
 *     description: Fetch list of articles
 *     tags: [ARTICLES]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by article title
 *         example: Smart Money
 *     responses:
 *       200:
 *         description: Articles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/articles/detail/{articleId}:
 *   get:
 *     summary: Get article by ID
 *     description: Fetch single article by ID
 *     tags: [ARTICLES]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article fetched successfully
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
 *                   $ref: '#/components/schemas/Article'
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (invalid articleId)
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/articles:
 *   patch:
 *     summary: Update article
 *     description: Update article by ID
 *     tags: [ARTICLES]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articleId
 *             properties:
 *               articleId:
 *                 type: number
 *                 example: 1
 *               articleTitle:
 *                 type: string
 *                 example: Updated article title
 *               articleDescription:
 *                 type: string
 *                 example: Updated article description
 *               articleImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/articles/{articleId}:
 *   delete:
 *     summary: Delete article
 *     description: Soft delete article by ID
 *     tags: [ARTICLES]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
