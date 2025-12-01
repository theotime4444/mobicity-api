import {Router} from 'express';
import {
    getUser,
    getAllUsers,
    createUser,
    updateUserByAdmin,
    deleteUser
} from "../../../controler/user.js";
import {userValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/admin/users:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get all users (Admin only)
 *      description: Returns a list of all users with pagination
 *      parameters:
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of results to return
 *           example: 50
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: Number of results to skip
 *           example: 0
 *      responses:
 *          200:
 *              description: List of users
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /v1/admin/users/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get a user by ID (Admin only)
 *      description: Returns a single user with all information
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user to get
 *      responses:
 *          200:
 *              description: User information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: User not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getUser);

/**
 * @swagger
 * /v1/admin/users:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Create a new user (Admin only)
 *      description: Creates a new user account
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserToAdd'
 *      responses:
 *          201:
 *              description: User created successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          409:
 *              description: Email already exists
 *          500:
 *              description: Error server
 */
router.post('/', userValidatorMiddleware.create, createUser);

/**
 * @swagger
 * /v1/admin/users:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Update a user (Admin only)
 *      description: Updates an existing user's information
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserToUpdate'
 *      responses:
 *          204:
 *              description: User updated successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.patch('/', userValidatorMiddleware.update, updateUserByAdmin);

/**
 * @swagger
 * /v1/admin/users/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Delete a user (Admin only)
 *      description: Deletes a user by its ID
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user to delete
 *      responses:
 *          204:
 *              description: User deleted successfully
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.delete('/:id', deleteUser);

export default router;

