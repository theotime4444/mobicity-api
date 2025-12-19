import {Router} from 'express';
import {
    getAllFavorites,
    getFavoritesByUser
} from "../../../controler/favorite.js";

const router = Router();

/**
 * @swagger
 * /v1/admin/favorites:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get all favorites (Admin only)
 *      description: Returns a list of all favorites with optional filtering
 *      parameters:
 *         - in: query
 *           name: userId
 *           schema:
 *             type: integer
 *           description: Filter by user ID
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of results to return
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: Number of results to skip
 *      responses:
 *          200:
 *              description: List of favorites
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Favorite'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/', getAllFavorites);

/**
 * @swagger
 * /v1/admin/favorites/users/{userId}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get favorites by user (Admin only)
 *      description: Returns all favorite transport locations for a specific user
 *      parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user
 *      responses:
 *          200:
 *              description: List of favorites
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Favorite'
 *          400:
 *              description: Invalid user ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/users/:userId', getFavoritesByUser);

export default router;

