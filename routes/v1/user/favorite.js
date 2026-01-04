import {Router} from 'express';
import {
    getMyFavorites,
    addMyFavorite,
    deleteMyFavorite,
    getMyFavoritesNearby
} from "../../../controler/favorite.js";
import {favoriteValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/favorites/me:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Favorite
 *      summary: Get current user's favorites
 *      description: Returns all favorite transport locations for the authenticated user
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
 *          500:
 *              description: Error server
 */
router.get('/me', getMyFavorites);

/**
 * @swagger
 * /v1/favorites/me/nearby:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Favorite
 *      summary: Get current user's favorites nearby a point
 *      description: Returns favorite transport locations for the authenticated user, sorted by distance from a given point using Haversine formula
 *      parameters:
 *         - in: query
 *           name: latitude
 *           required: true
 *           schema:
 *             type: number
 *           description: Latitude of the reference point (between -90 and 90)
 *           example: 50.4674
 *         - in: query
 *           name: longitude
 *           required: true
 *           schema:
 *             type: number
 *           description: Longitude of the reference point (between -180 and 180)
 *           example: 4.8719
 *         - in: query
 *           name: radius
 *           schema:
 *             type: number
 *           description: Maximum radius in kilometers (optional, no limit if not provided)
 *           example: 5
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of results to return (default is 50)
 *           example: 20
 *         - in: query
 *           name: categoryId
 *           schema:
 *             type: integer
 *           description: Filter by category ID
 *           example: 1
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: Search term for address
 *           example: bus
 *      responses:
 *          200:
 *              description: List of transport locations with distance
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/TransportLocationWithDistance'
 *          400:
 *              description: Invalid parameters
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.get('/me/nearby', favoriteValidatorMiddleware.nearby, getMyFavoritesNearby);

/**
 * @swagger
 * /v1/favorites/me:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Favorite
 *      summary: Add a favorite
 *      description: Adds a transport location to the authenticated user's favorites
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - transportLocationId
 *                      properties:
 *                          transportLocationId:
 *                              type: integer
 *      responses:
 *          201:
 *              description: Favorite added successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Favorite'
 *          400:
 *              description: Validation error
 *          409:
 *              description: Favorite already exists
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.post('/me', favoriteValidatorMiddleware.create, addMyFavorite);

/**
 * @swagger
 * /v1/favorites/me/{transportLocationId}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Favorite
 *      summary: Delete a favorite
 *      description: Removes a transport location from the authenticated user's favorites
 *      parameters:
 *         - in: path
 *           name: transportLocationId
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the transport location
 *      responses:
 *          204:
 *              description: Favorite deleted successfully
 *          400:
 *              description: Invalid transport location ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.delete('/me/:transportLocationId', deleteMyFavorite);

export default router;

