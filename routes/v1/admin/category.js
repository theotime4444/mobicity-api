import {Router} from 'express';
import {
    getAllCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
} from "../../../controler/category.js";
import {categoryValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/admin/categories:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get all categories (Admin only)
 *      description: Returns a list of all categories with optional search filtering
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: Search term to filter categories by name
 *           example: "bus"
 *      responses:
 *          200:
 *              description: List of categories
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /v1/admin/categories/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get a category by ID (Admin only)
 *      description: Returns a single category by its ID
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the category to get
 *      responses:
 *          200:
 *              description: Category information
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Category not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getCategory);

/**
 * @swagger
 * /v1/admin/categories:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Create a new category (Admin only)
 *      description: Creates a new transport location category
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CategoryToAdd'
 *      responses:
 *          201:
 *              description: Category created successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.post('/', categoryValidatorMiddleware.create, addCategory);

/**
 * @swagger
 * /v1/admin/categories:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Update a category (Admin only)
 *      description: Updates an existing category
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CategoryToUpdate'
 *      responses:
 *          204:
 *              description: Category updated successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.patch('/', categoryValidatorMiddleware.update, updateCategory);

/**
 * @swagger
 * /v1/admin/categories/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Delete a category (Admin only)
 *      description: Deletes a category by its ID. All associated transport locations are also deleted (cascade delete). The operation is atomic (transaction).
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the category to delete
 *      responses:
 *          200:
 *              description: Category and associated transport locations deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              deletedCategory:
 *                                  type: boolean
 *                                  example: true
 *                              deletedTransportLocations:
 *                                  type: integer
 *                                  description: Number of transport locations that were deleted
 *                                  example: 5
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Category not found
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.delete('/:id', deleteCategory);

export default router;

