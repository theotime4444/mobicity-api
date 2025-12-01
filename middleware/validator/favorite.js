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

export const favoriteToAdd = vine.compile(favoriteToAddSchema);

