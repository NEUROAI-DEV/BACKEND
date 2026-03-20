/**
 * @swagger
 * tags:
 *   - name: UPLOAD
 *     description: File upload (images)
 */

/**
 * @swagger
 * /api/v1/uploads/images:
 *   post:
 *     summary: Upload image to Cloudinary
 *     tags: [UPLOAD]
 *     description: |
 *       Upload a single image (multipart/form-data) and store it in Cloudinary.
 *       Max file size 2MB. Allowed types: JPEG, PNG, GIF, WebP.
 *       Returns Cloudinary URL.
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
 *                     url:
 *                       type: string
 *                       description: Cloudinary URL to access the image
 *                       example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (no file, file too large &gt; 2MB, or invalid file type)
 *       500:
 *         description: Internal server error
 */
