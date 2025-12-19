import {Router} from 'express';
import {
    getTransportLocations,
    getTransportLocation,
    addTransportLocation,
    updateTransportLocation,
    deleteTransportLocation
} from "../../../controler/transportLocation.js";
import {transportLocationValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/admin/transport-locations:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get all transport locations (Admin only)
 *      description: Returns a list of all transport locations with optional filtering and pagination
 *      parameters:
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of results to return
 *           example: 10
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: Number of results to skip
 *           example: 0
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
 *           description: Search term to filter transport locations by address or category name
 *           example: "gare"
 *      responses:
 *          200:
 *              description: List of transport locations
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/', getTransportLocations);

/**
 * @swagger
 * /v1/admin/transport-locations/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get a transport location by ID (Admin only)
 *      description: Returns a single transport location by its ID
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the transport location to get
 *      responses:
 *          200:
 *              description: Transport location information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TransportLocation'
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Transport location not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getTransportLocation);

/**
 * @swagger
 * /v1/admin/transport-locations:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Create a new transport location (Admin only)
 *      description: Creates a new transport location (bus stop, train station, etc.)
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TransportLocationToAdd'
 *      responses:
 *          201:
 *              description: Transport location created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/TransportLocation'
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.post('/', transportLocationValidatorMiddleware.create, addTransportLocation);

/**
 * @swagger
 * /v1/admin/transport-locations:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Update a transport location (Admin only)
 *      description: Updates an existing transport location
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TransportLocationToUpdate'
 *      responses:
 *          204:
 *              description: Transport location updated successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.patch('/', transportLocationValidatorMiddleware.update, updateTransportLocation);

/**
 * @swagger
 * /v1/admin/transport-locations/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Delete a transport location (Admin only)
 *      description: Deletes a transport location by its ID
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the transport location to delete
 *      responses:
 *          204:
 *              description: Transport location deleted successfully
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.delete('/:id', deleteTransportLocation);

export default router;

