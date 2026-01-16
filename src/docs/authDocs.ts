/**
 * @swagger
 * components:
 *   schemas:
 *     IAdministratorLoginRequest:
 *       type: object
 *       properties:
 *         userWhatsappNumber:
 *           type: string
 *           example: 6281234567891
 *         userPassword:
 *           type: string
 *           example: qwerty
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     IEmployeeRegisterRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           example: John Doe
 *         userWhatsappNumber:
 *           type: string
 *           example: 6281234567891
 *         userPassword:
 *           type: string
 *           example: qwerty
 *         userDeviceId:
 *           type: string
 *           example: RP1A.200720.012.A105GDXS8CVL5
 *         userInvitationCode:
 *           type: string
 *           example: E7KQ4A
 *     IEmployeeLoginRequest:
 *       type: object
 *       properties:
 *         userWhatsappNumber:
 *           type: string
 *           example: 6281234567891
 *         userPassword:
 *           type: string
 *           example: qwerty
 *         userDeviceId:
 *           type: string
 *           example: RP1A.200720.012.A105GDXS8CVL5
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ICompanyRegisterRequest:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           required:
 *             - userName
 *             - userPassword
 *             - userWhatsappNumber
 *           properties:
 *             userName:
 *               type: string
 *               example: John Doe
 *             userPassword:
 *               type: string
 *               example: password123
 *             userWhatsappNumber:
 *               type: string
 *               example: 6281234567890
 *         company:
 *           type: object
 *           required:
 *             - companyName
 *             - companyIndustry
 *           properties:
 *             companyName:
 *               type: string
 *               example: PT Satuflow Teknologi
 *             companyIndustry:
 *               type: string
 *               example: SaaS
 *     ICompanyLoginRequest:
 *       type: object
 *       properties:
 *         userWhatsappNumber:
 *           type: string
 *           example: 6281234567890
 *         userPassword:
 *           type: string
 *           example: password123
 *
 */

/**
 * @swagger
 * /api/v1/auth/login/administrators:
 *   post:
 *     summary: Login a administrator
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IAdministratorLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/login/employees:
 *   post:
 *     summary: Login a user
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IEmployeeLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/register/employees:
 *   post:
 *     summary: Register a new user
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IEmployeeRegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/auth/register/companies:
 *   post:
 *     summary: Register a company and its owner (admin)
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICompanyRegisterRequest'
 *     responses:
 *       201:
 *         description: Company and owner user registered successfully
 *       400:
 *         description: Invalid input or duplicate WhatsApp number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/auth/login/companies:
 *   post:
 *     summary: Login a user
 *     tags: [AUTH]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICompanyLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
