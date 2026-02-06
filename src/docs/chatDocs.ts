/**
 * @swagger
 * tags:
 *   - name: CHAT
 *     description: LLM-based chat with AI assistant
 */

/**
 * @swagger
 * /api/v1/chat:
 *   post:
 *     summary: Chat with AI assistant
 *     tags: [CHAT]
 *     description: |
 *       Send a message to the AI assistant and receive a reply.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User message to the AI assistant
 *                 example: "Jelaskan apa itu Bitcoin dalam bahasa sederhana."
 *               context:
 *                 type: string
 *                 nullable: true
 *                 description: Optional additional context for the assistant
 *                 example: "User adalah pemula yang baru mengenal crypto."
 *     responses:
 *       200:
 *         description: Chat response generated successfully
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
 *                     reply:
 *                       type: string
 *                       description: AI assistant reply text
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

