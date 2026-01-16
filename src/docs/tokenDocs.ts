/**
 * @swagger
 * tags:
 *   name: TOKENS
 *   description: Token screening & validation APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TokenScreeningRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         deviceId:
 *           type: string
 *           example: "DEVICE-ABC-123"
 *         platform:
 *           type: string
 *           enum: [web, android, ios]
 *           example: "web"
 *
 *     TokenScreeningResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Token is valid"
 *         data:
 *           type: object
 *           properties:
 *             isValid:
 *               type: boolean
 *               example: true
 *             expiredAt:
 *               type: string
 *               format: date-time
 *               example: "2026-01-08T12:00:00Z"
 *             userId:
 *               type: number
 *               example: 10
 */

/**
 * @swagger
 * /api/v1/tokens/screening:
 *   post:
 *     summary: Screen and validate token
 *     tags: [TOKENS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenScreeningRequest'
 *     responses:
 *       200:
 *         description: Token screening success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenScreeningResponse'
 *       400:
 *         description: Invalid token or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       401:
 *         description: Unauthorized / token expired
 *       500:
 *         description: Server error
 */
