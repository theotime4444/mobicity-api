import {Router} from 'express';
import {getAllCategories, getCategory} from "../../../controler/category.js";

const router = Router();

/**
 * @swagger
 * /v1/categories:
 *  get:
 *      tags:
 *          - Category
 *      summary: Get all categories
 *      description: Returns a list of all transport location categories (public)
 *      responses:
 *          200:
 *              description: List of categories
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Category'
 *          500:
 *              description: Error server
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /v1/categories/{id}:
 *  get:
 *      tags:
 *          - Category
 *      summary: Get a category by ID
 *      description: Returns a single category by its ID (public)
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Category not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getCategory);

export default router;

