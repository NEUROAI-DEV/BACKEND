/**
 * @swagger
 * tags:
 *   - name: OTP
 *     description: One-time password (OTP) via email
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     OtpRequest:
 *       type: object
 *       required:
 *         - userEmail
 *         - otpType
 *       properties:
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         otpType:
 *           type: string
 *           enum: [register, reset]
 *           example: "register"
 *     OtpVerify:
 *       type: object
 *       required:
 *         - userEmail
 *         - otpCode
 *       properties:
 *         userEmail:
 *           type: string
 *           example: "user@example.com"
 *         otpCode:
 *           type: string
 *           example: "123456"
 */
/**
 * @swagger
 * /api/v1/otp/request:
 *   post:
 *     summary: Request OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpRequest'
 *     responses:
 *       201:
 *         description: OTP sent successfully
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
 *                 meta:
 *                   type: object
 *       400:
 *         description: Bad request (email already registered / not registered / validation)
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/v1/otp/verify:
 *   post:
 *     summary: Verify OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerify'
 *     responses:
 *       201:
 *         description: OTP verified successfully
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
 *                     message:
 *                       type: string
 *                       example: "OTP verified successfully"
 *                 meta:
 *                   type: object
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
