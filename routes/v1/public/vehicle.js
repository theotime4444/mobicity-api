import {Router} from 'express';
import {getAllVehicles, getVehicle} from "../../../controler/vehicle.js";

const router = Router();

/**
 * @swagger
 * /v1/vehicles:
 *  get:
 *      tags:
 *          - Vehicle
 *      summary: Get all vehicles
 *      description: Returns a list of all vehicles (public)
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: Search term to filter vehicles by brand or model
 *           example: "bus"
 *      responses:
 *          200:
 *              description: List of vehicles
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Vehicle'
 *          500:
 *              description: Error server
 */
router.get('/', getAllVehicles);

/**
 * @swagger
 * /v1/vehicles/{id}:
 *  get:
 *      tags:
 *          - Vehicle
 *      summary: Get a vehicle by ID
 *      description: Returns a single vehicle by its ID (public)
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the vehicle to get
 *      responses:
 *          200:
 *              description: Vehicle information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Vehicle'
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Vehicle not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getVehicle);

export default router;

