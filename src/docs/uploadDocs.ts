/**
 * @swagger
 * tags:
 *   - name: UPLOAD
 *     description: File upload (images)
 */

/**
 * @swagger
 * /api/v1/upload/image:
 *   post:
 *     summary: Upload image
 *     tags: [UPLOAD]
 *     description: |
 *       Upload a single image. Max file size 2MB.
 *       Allowed types: JPEG, PNG, GIF, WebP.
 *       Returns file name and URL to access the image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 2MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       description: Stored file name (e.g. uuid + extension)
 *                       example: a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
 *                     url:
 *                       type: string
 *                       description: Full URL to access the image
 *                       example: http://localhost:8000/uploads/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (no file, file too large &gt; 2MB, or invalid file type)
 *       500:
 *         description: Internal server error
 */
