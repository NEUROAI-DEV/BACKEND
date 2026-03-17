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

/**
 * @swagger
 * /api/v1/uploads:
 *   get:
 *     summary: Upload image to Cloudinary (data URI)
 *     tags: [UPLOAD]
 *     description: |
 *       Upload image to Cloudinary using a data URI passed via query string.
 *       **Note**: For large images, prefer POST multipart upload.
 *     parameters:
 *       - in: query
 *         name: imageBase64
 *         required: true
 *         schema:
 *           type: string
 *         description: Data URI image string, e.g. data:image/png;base64,iVBOR...
 *       - in: query
 *         name: folder
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional Cloudinary folder (default "uploads")
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Cloudinary URL
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (missing/invalid data URI)
 *       500:
 *         description: Internal server error
 */
