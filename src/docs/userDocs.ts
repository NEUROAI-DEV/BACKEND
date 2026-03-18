/**
 * @swagger
 * tags:
 *   - name: USERS
 *     description: User list and admin management (authenticated)
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (role user only)
 *     tags: [USERS]
 *     description: |
 *       Returns paginated list of users (userRole = "user") from the users table.
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
 *         name: size
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
 *           example: john
 *         description: Search by user name or email (partial match, case-insensitive)
 *       - in: query
 *         name: pagination
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Enable pagination (true to paginate, false to return all)
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

/**
 * @swagger
 * /api/v1/users/admin:
 *   post:
 *     summary: Create admin user
 *     tags: [USERS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - userEmail
 *               - userPassword
 *             properties:
 *               userName:
 *                 type: string
 *                 example: Admin 1
 *               userEmail:
 *                 type: string
 *                 example: admin@example.com
 *               userPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Validation error or email already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/admin:
 *   patch:
 *     summary: Update admin user
 *     tags: [USERS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               userName:
 *                 type: string
 *                 example: Updated Admin
 *               userEmail:
 *                 type: string
 *                 example: new-admin@example.com
 *               userPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Admin user updated successfully
 *       400:
 *         description: Validation error or email already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Admin user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/admin/{userId}:
 *   delete:
 *     summary: Delete admin user
 *     tags: [USERS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Admin user deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Admin user not found
 *       500:
 *         description: Internal server error
 */
