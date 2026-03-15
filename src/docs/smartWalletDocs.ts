/**
 * @swagger
 * tags:
 *   - name: SMART_WALLETS
 *     description: Smart wallet master data (address & name)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     SmartWallet:
 *       type: object
 *       properties:
 *         smartWalletId:
 *           type: integer
 *           example: 1
 *         smartWalletAddress:
 *           type: string
 *           example: 0x28C6c06298d514Db089934071355E5743bf21d60
 *         smartWalletName:
 *           type: string
 *           example: Binance 8
 */
/**
 * @swagger
 * /api/v1/smart-wallets:
 *   get:
 *     summary: Get all smart wallets
 *     tags: [SMART_WALLETS]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by smartWalletAddress or smartWalletName
 *     responses:
 *       200:
 *         description: Smart wallets fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SmartWallet'
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 meta:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/smart-wallets/detail/{smartWalletId}:
 *   get:
 *     summary: Get smart wallet detail
 *     tags: [SMART_WALLETS]
 *     parameters:
 *       - in: path
 *         name: smartWalletId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Smart wallet fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SmartWallet'
 *                 meta:
 *                   type: object
 *       404:
 *         description: Smart wallet not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/smart-wallets:
 *   post:
 *     summary: Create smart wallet
 *     tags: [SMART_WALLETS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - smartWalletAddress
 *               - smartWalletName
 *             properties:
 *               smartWalletAddress:
 *                 type: string
 *                 example: 0x28C6c06298d514Db089934071355E5743bf21d60
 *               smartWalletName:
 *                 type: string
 *                 example: Binance 8
 *     responses:
 *       201:
 *         description: Smart wallet created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/smart-wallets:
 *   patch:
 *     summary: Update smart wallet
 *     tags: [SMART_WALLETS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - smartWalletId
 *             properties:
 *               smartWalletId:
 *                 type: integer
 *                 example: 1
 *               smartWalletAddress:
 *                 type: string
 *               smartWalletName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Smart wallet updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Smart wallet not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/smart-wallets/{smartWalletId}:
 *   delete:
 *     summary: Delete smart wallet
 *     tags: [SMART_WALLETS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: smartWalletId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Smart wallet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Smart wallet not found
 *       500:
 *         description: Internal server error
 */
