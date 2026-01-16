/**
 * @swagger
 * components:
 *   schemas:
 *     IMembershipFindAllRequest:
 *       type: object
 *       properties:
 *         membershipId:
 *           type: number
 *           example: 1
 *         page:
 *           type: number
 *           example: 1
 *         size:
 *           type: number
 *           example: 10
 *         search:
 *           type: string
 *           example: "John"
 *         pagination:
 *           type: boolean
 *           example: true
 *       required:
 *         - membershipId
 *
 *     IMembershipUpdateRequest:
 *       type: object
 *       properties:
 *         membershipId:
 *           type: number
 *           example: 1
 *         membershipStatus:
 *           type: string
 *           enum: ['active','pending','rejected']
 *           example: active
 *         membershipOfficeId:
 *           type: number
 *           nullable: true
 *       required:
 *         - membershipId
 *
 *     IMembershipInviteRequest:
 *       type: object
 *       properties:
 *         inviteCode:
 *           type: string
 *           example: INV123ABC
 *       required:
 *         - inviteCode
 */

/**
 * @swagger
 * /api/v1/memberships:
 *   get:
 *     summary: Get all membership entries
 *     tags: [MEMBERSHIPS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of memberships

 *   patch:
 *     summary: Update membership status
 *     tags: [MEMBERSHIPS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IMembershipUpdateRequest'
 *     responses:
 *       200:
 *         description: Membership updated
 *       400:
 *         description: Invalid input
 *
 */

/**
 * @swagger
 * /api/v1/memberships/{membershipId}:
 *   delete:
 *     summary: Remove a membership
 *     tags: [MEMBERSHIPS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: membershipId
 *         required: true
 *         schema:
 *           type: number
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *     responses:
 *       200:
 *         description: Membership deleted
 *       404:
 *         description: Membership not found
 */

/**
 * @swagger
 * /api/v1/memberships/invite:
 *   post:
 *     summary: Join a company using invite code
 *     tags: [MEMBERSHIPS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IMembershipInviteRequest'
 *     responses:
 *       201:
 *         description: Successfully joined company
 *       400:
 *         description: Invalid invitation code
 */
