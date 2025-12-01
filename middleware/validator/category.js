import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryToAdd:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  example: Arrêt de bus
 *      CategoryToUpdate:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 */

const categoryToAddSchema = vine.object({
    name: vine.string().trim().minLength(1)
});

const categoryToUpdateSchema = vine.object({
    id: vine.number(),
    name: vine.string().trim().minLength(1).optional()
});

export const
    categoryToAdd = vine.compile(categoryToAddSchema),
    categoryToUpdate = vine.compile(categoryToUpdateSchema);

