import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      FavoriteToAdd:
 *          type: object
 *          required:
 *              - transportLocationId
 *          properties:
 *              transportLocationId:
 *                  type: integer
 *                  example: 1
 */

const favoriteToAddSchema = vine.object({
    transportLocationId: vine.number()
});

const favoriteNearbySchema = vine.object({
    latitude: vine.number().min(-90).max(90),
    longitude: vine.number().min(-180).max(180),
    radius: vine.number().positive().optional(),
    limit: vine.number().positive().optional(),
    categoryId: vine.number().optional(),
    search: vine.string().trim().optional()
});

export const 
    favoriteToAdd = vine.compile(favoriteToAddSchema),
    favoriteNearby = vine.compile(favoriteNearbySchema);

