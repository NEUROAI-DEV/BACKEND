/**
 * @swagger
 * components:
 *   schemas:
 *     IFindAllEmployeeRequest:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 0
 *         size:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           example: 10
 *         userRole:
 *           type: string
 *           nullable: true
 *           example: "employee"
 *         search:
 *           type: string
 *           nullable: true
 *           example: "John"
 *         pagination:
 *           type: boolean
 *           default: true
 *           example: true
 *         employeeId:
 *           type: string
 *           nullable: true
 *           example: "EMP-001"
 *
 *     IFindDetailEmployeeRequest:
 *       type: object
 *       properties:
 *         employeeId:
 *           type: string
 *           example: "EMP-001"
 *       required:
 *         - employeeId
 *
 *     IEmployeeUpdateRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           example: 1
 *         userWhatsappNumber:
 *           type: string
 *           example: "6284455334434"
 *         userDeviceId:
 *           type: string
 *           example: "2131231233112"
 *       required:
 *         - userId
 */

/**
 * @swagger
 * /api/v1/employees/:
 *   get:
 *     summary: Get list of employees with filters
 *     tags: [EMPLOYEES]
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
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: query
 *         name: userRole
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: pagination
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees
 */

/**
 * @swagger
 * /api/v1/employees/detail/{employeeId}:
 *   get:
 *     summary: Get employee detail by ID
 *     tags: [EMPLOYEES]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-company-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID fortenant contex (multi-tenant)
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee detail
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /api/v1/employees:
 *   patch:
 *     summary: Update employee
 *     tags: [EMPLOYEES]
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
 *             $ref: '#/components/schemas/IEmployeeUpdateRequest'
 *     responses:
 *       201:
 *         description: employee updated successfully
 *       400:
 *         description: Invalid input
 */
