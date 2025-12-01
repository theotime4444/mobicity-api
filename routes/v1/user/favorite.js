import {Router} from 'express';
import {
    getMyFavorites,
    addMyFavorite,
    deleteMyFavorite
} from "../../../controler/favorite.js";
import {checkJWT} from "../../../middleware/identification/jwt.js";
import {favoriteValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

// Toutes les routes nécessitent checkJWT
router.use(checkJWT);

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

