import {Router} from 'express';
import {
    getAllVehicles,
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle
} from "../../../controler/vehicle.js";
import {vehicleValidatorMiddleware} from "../../../middleware/validation.js";

const router = Router();

/**
 * @swagger
 * /v1/admin/vehicles:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get all vehicles (Admin only)
 *      description: Returns a list of all vehicles
 *      responses:
 *          200:
 *              description: List of vehicles
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.get('/', getAllVehicles);

/**
 * @swagger
 * /v1/admin/vehicles/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Get a vehicle by ID (Admin only)
 *      description: Returns a single vehicle by its ID
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
 *          400:
 *              description: Invalid ID
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          404:
 *              description: Vehicle not found
 *          500:
 *              description: Error server
 */
router.get('/:id', getVehicle);

/**
 * @swagger
 * /v1/admin/vehicles:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Create a new vehicle (Admin only)
 *      description: Creates a new vehicle
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VehicleToAdd'
 *      responses:
 *          201:
 *              description: Vehicle created successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.post('/', vehicleValidatorMiddleware.create, addVehicle);

/**
 * @swagger
 * /v1/admin/vehicles:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Update a vehicle (Admin only)
 *      description: Updates an existing vehicle
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VehicleToUpdate'
 *      responses:
 *          204:
 *              description: Vehicle updated successfully
 *          400:
 *              description: Validation error
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.patch('/', vehicleValidatorMiddleware.update, updateVehicle);

/**
 * @swagger
 * /v1/admin/vehicles/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Admin
 *      summary: Delete a vehicle (Admin only)
 *      description: Deletes a vehicle by its ID. All associated transport locations are also deleted (cascade delete). The operation is atomic (transaction).
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the vehicle to delete
 *      responses:
 *          200:
 *              description: Vehicle and associated transport locations deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              deletedVehicle:
 *                                  type: boolean
 *                                  example: true
 *                              deletedTransportLocations:
 *                                  type: integer
 *                                  description: Number of transport locations that were deleted
 *                                  example: 3
 *          400:
 *              description: Invalid ID
 *          404:
 *              description: Vehicle not found
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          403:
 *              $ref: '#/components/responses/mustBeAdmin'
 *          500:
 *              description: Error server
 */
router.delete('/:id', deleteVehicle);

export default router;

