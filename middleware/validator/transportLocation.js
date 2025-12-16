import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      TransportLocationWithDistance:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              categoryId:
 *                  type: integer
 *                  nullable: true
 *              vehicleId:
 *                  type: integer
 *                  nullable: true
 *              address:
 *                  type: string
 *                  nullable: true
 *              latitude:
 *                  type: string
 *                  format: decimal
 *                  nullable: true
 *              longitude:
 *                  type: string
 *                  format: decimal
 *                  nullable: true
 *              distance:
 *                  type: number
 *                  description: Distance from the reference point in kilometers (calculated using Haversine formula)
 *              category:
 *                  $ref: '#/components/schemas/Category'
 *              vehicle:
 *                  $ref: '#/components/schemas/Vehicle'
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

const transportLocationNearbySchema = vine.object({
    latitude: vine.number().min(-90).max(90),
    longitude: vine.number().min(-180).max(180),
    radius: vine.number().positive().optional(),
    limit: vine.number().positive().optional(),
    categoryId: vine.number().optional(),
    search: vine.string().trim().optional()
});

export const
    transportLocationToAdd = vine.compile(transportLocationToAddSchema),
    transportLocationToUpdate = vine.compile(transportLocationToUpdateSchema),
    transportLocationNearby = vine.compile(transportLocationNearbySchema);

