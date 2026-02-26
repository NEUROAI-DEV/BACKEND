/**
 * @swagger
 * tags:
 *   - name: SUBSCRIPTION
 *     description: Free tier 30 hari dan langganan bulanan (premium screener)
 */

/**
 * @swagger
 * /api/v1/subscriptions/free-trial:
 *   post:
 *     summary: Aktifkan free trial 30 hari
 *     tags: [SUBSCRIPTION]
 *     description: |
 *       Mengaktifkan free tier 30 hari untuk user. Hanya bisa dipakai sekali;
 *       jika user sudah pernah pakai free trial (plan free dan status bukan inactive) akan ditolak.
 *       Setelah aktif, user bisa mengakses fitur premium (screener).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Tidak perlu body; userId diambil dari JWT
 *     responses:
 *       200:
 *         description: Free trial berhasil diaktifkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Free trial started successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userSubscriptionStatus:
 *                       type: string
 *                       enum: [active]
 *                     userSubscriptionPlan:
 *                       type: string
 *                       enum: [free]
 *                     userSubscriptionStartDate:
 *                       type: string
 *                       format: date-time
 *                     userSubscriptionEndDate:
 *                       type: string
 *                       format: date-time
 *                 meta:
 *                   type: object
 *       400:
 *         description: Sudah punya subscription aktif atau free trial sudah pernah dipakai
 *       401:
 *         description: Unauthorized (token hilang atau tidak valid)
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subscriptions/subscribe/monthly:
 *   post:
 *     summary: Langganan bulanan (premium)
 *     tags: [SUBSCRIPTION]
 *     description: |
 *       Mengaktifkan langganan bulanan (plan pro). User perlu membayar langganan terlebih dahulu
 *       (integrasi pembayaran dapat ditambahkan di sini). Setelah aktif, user bisa mengakses fitur premium (screener).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Tidak perlu body; userId diambil dari JWT. Nantinya bisa ditambah payload untuk payment reference.
 *     responses:
 *       200:
 *         description: Langganan bulanan berhasil diaktifkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Monthly subscription activated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userSubscriptionStatus:
 *                       type: string
 *                       enum: [active]
 *                     userSubscriptionPlan:
 *                       type: string
 *                       enum: [pro]
 *                     userSubscriptionStartDate:
 *                       type: string
 *                       format: date-time
 *                     userSubscriptionEndDate:
 *                       type: string
 *                       format: date-time
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized (token hilang atau tidak valid)
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal server error
 */
