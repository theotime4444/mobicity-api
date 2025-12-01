import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      VehicleToAdd:
 *          type: object
 *          properties:
 *              brand:
 *                  type: string
 *                  example: Mercedes
 *              model:
 *                  type: string
 *                  example: Citaro
 *      VehicleToUpdate:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: integer
 *              brand:
 *                  type: string
 *              model:
 *                  type: string
 */

const vehicleToAddSchema = vine.object({
    brand: vine.string().trim().optional(),
    model: vine.string().trim().optional()
});

const vehicleToUpdateSchema = vine.object({
    id: vine.number(),
    brand: vine.string().trim().optional(),
    model: vine.string().trim().optional()
});

export const
    vehicleToAdd = vine.compile(vehicleToAddSchema),
    vehicleToUpdate = vine.compile(vehicleToUpdateSchema);

