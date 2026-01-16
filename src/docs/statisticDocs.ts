/**
 * @swagger
 * /api/v1/statistic/productivities:
 *   get:
 *     summary: Hitung statistik produktivitas
 *     description: Hitung total jam kerja, istirahat, dan lembur berdasarkan schedule ID
 *     tags: [STATISTIC]
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *       - name: attendanceScheduleId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: attendanceUserId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: attendanceTimeRange
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalWorkTime:
 *                   type: string
 *                 totalBreakTime:
 *                   type: string
 *                 totalOvertime:
 *                   type: string
 */

/**
 * @openapi
 * /api/v1/statistic/total:
 *   get:
 *     summary: Mengambil jumlah total pengguna dan toko
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *     description: |
 *       Endpoint ini mengembalikan jumlah total:
 *       - Pengguna biasa (`user`)
 *       - Admin (`admin`)
 *       - Super Admin (`superadmin`)
 *       - Toko aktif (`deleted = 0`)
 *     tags: [STATISTIC]
 *     responses:
 *       200:
 *         description: Data statistik berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalAdmins:
 *                   type: integer
 *                 totalSuperAdmins:
 *                   type: integer
 *                 totalStores:
 *                   type: integer
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
