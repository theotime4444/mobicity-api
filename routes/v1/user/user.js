import {Router} from 'express';
import {getCurrentUser, updateCurrentUser} from "../../../controler/user.js";
import {userValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/users/me:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      summary: Get current user's information
 *      description: Returns the authenticated user's information
 *      responses:
 *          200:
 *              description: User information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.get('/me', getCurrentUser);

/**
 * @swagger
 * /v1/users/me:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      summary: Update current user's information
 *      description: Allows a user to update their own information
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserToUpdate'
 *      responses:
 *          204:
 *              description: User updated successfully
 *          400:
 *              description: Validation error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                              details:
 *                                  type: object
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.patch('/me', userValidatorMiddleware.update, updateCurrentUser);

export default router;

