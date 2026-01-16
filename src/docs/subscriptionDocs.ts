/**
 * @swagger
 * /api/v1/subscriptions/my-subscriptions:
 *   get:
 *     summary: Get user profile detail by ID
 *     tags: [SUBSCRIPTIONS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *     responses:
 *       200:
 *         description: User profile detail
 *       404:
 *         description: User not found
 */
