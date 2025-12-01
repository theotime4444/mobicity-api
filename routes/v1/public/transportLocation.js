import {Router} from 'express';
import {getTransportLocations, getTransportLocation} from "../../../controler/transportLocation.js";

const router = Router();

/**
 * @swagger
 * /v1/transport-locations:
 *  get:
 *      tags:
 *          - TransportLocation
 *      summary: Get transport locations
 *      description: Returns a list of transport locations with optional filtering and pagination (public)
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
 *           description: Search term for address or category name
 *           example: bus
 *      responses:
 *          200:
 *              description: List of transport locations
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/TransportLocation'
 *          500:
 *              description: Error server
 */
router.get('/', getTransportLocations);

/**
 * @swagger
 * /v1/transport-locations/{id}:
 *  get:
 *      tags:
 *          - TransportLocation
 *      summary: Get a transport location by ID
 *      description: Returns a single transport location by its ID (public)
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
 *          404:
 *              description: Transport location not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getTransportLocation);

export default router;

