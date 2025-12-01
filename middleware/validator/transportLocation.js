import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      TransportLocationToAdd:
 *          type: object
 *          required:
 *              - address
 *          properties:
 *              categoryId:
 *                  type: integer
 *                  example: 1
 *              vehicleId:
 *                  type: integer
 *                  nullable: true
 *                  example: 1
 *              address:
 *                  type: string
 *                  example: Place de la Gare, 5000 Namur
 *              latitude:
 *                  type: number
 *                  description: Latitude (entre -90 et 90)
 *                  example: 50.4674
 *              longitude:
 *                  type: number
 *                  description: Longitude (entre -180 et 180)
 *                  example: 4.8719
 *      TransportLocationToUpdate:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: integer
 *              categoryId:
 *                  type: integer
 *              vehicleId:
 *                  type: integer
 *                  nullable: true
 *              address:
 *                  type: string
 *              latitude:
 *                  type: number
 *                  description: Latitude (entre -90 et 90)
 *              longitude:
 *                  type: number
 *                  description: Longitude (entre -180 et 180)
 */

const transportLocationToAddSchema = vine.object({
    categoryId: vine.number().optional(),
    vehicleId: vine.number().optional(),
    address: vine.string().trim().minLength(1),
    latitude: vine.number().min(-90).max(90).optional(),
    longitude: vine.number().min(-180).max(180).optional()
});

const transportLocationToUpdateSchema = vine.object({
    id: vine.number(),
    categoryId: vine.number().optional(),
    vehicleId: vine.number().optional(),
    address: vine.string().trim().minLength(1).optional(),
    latitude: vine.number().min(-90).max(90).optional(),
    longitude: vine.number().min(-180).max(180).optional()
});

export const
    transportLocationToAdd = vine.compile(transportLocationToAddSchema),
    transportLocationToUpdate = vine.compile(transportLocationToUpdateSchema);

