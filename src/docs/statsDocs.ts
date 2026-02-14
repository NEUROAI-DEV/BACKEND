/**
 * @swagger
 * tags:
 *   - name: STATS
 *     description: Statistik ringkas (jumlah user, article, dokumen index)
 */

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Dapatkan total user, subscriber, article, dan dokumen ter-index
 *     tags: [STATS]
 *     description: |
 *       Menghitung dari database utama:
 *       - totalUsers: semua user (tabel users)
 *       - totalSubscribedUsers: user dengan subscription status active (tabel users)
 *       - totalArticles: semua article (tabel articles)
 *       - totalIndexedDocuments: semua dokumen yang sudah di-index (tabel indexings)
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
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
 *                     totalUsers:
 *                       type: integer
 *                       description: Jumlah total user
 *                     totalSubscribedUsers:
 *                       type: integer
 *                       description: Jumlah user dengan subscription active
 *                     totalArticles:
 *                       type: integer
 *                       description: Jumlah total article
 *                     totalIndexedDocuments:
 *                       type: integer
 *                       description: Jumlah dokumen yang sudah di-index (RAG)
 *                 meta:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
