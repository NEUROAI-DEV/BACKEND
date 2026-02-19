/**
 * @swagger
 * tags:
 *   - name: USERS
 *     description: User list (authenticated)
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [USERS]
 *     description: |
 *       Returns paginated list of users from the users table.
 *       Password (userPassword) is never returned.
 *       Requires authentication (Bearer token).
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: john
 *         description: Search by user name or email (partial match, case-insensitive)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *                           userId:
 *                             type: integer
 *                             example: 1
 *                           userName:
 *                             type: string
 *                             example: John Doe
 *                           userEmail:
 *                             type: string
 *                             example: user@mail.com
 *                           userRole:
 *                             type: string
 *                             enum: [admin, user]
 *                             example: user
 *                           userOnboardingStatus:
 *                             type: string
 *                             enum: [waiting, completed]
 *                             example: completed
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
