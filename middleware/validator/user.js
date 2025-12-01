import vine from '@vinejs/vine';

/**
 * @swagger
 * components:
 *  schemas:
 *      UserToAdd:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *          properties:
 *              firstName:
 *                  type: string
 *                  example: Dupont
 *              lastName:
 *                  type: string
 *                  example: Jean
 *              email:
 *                  type: string
 *                  format: email
 *                  example: jean.dupont@mail.com
 *              password:
 *                  type: string
 *                  minLength: 6
 *                  example: password123
 *      UserToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              email:
 *                  type: string
 *                  format: email
 *              password:
 *                  type: string
 *                  minLength: 6
 *              isAdmin:
 *                  type: boolean
 */

const userToAddSchema = vine.object({
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
    email: vine.string().trim().email(),
    password: vine.string().minLength(6),
    isAdmin: vine.boolean().optional() // Optionnel pour les admins
});

const userToUpdateSchema = vine.object({
    id: vine.number().optional(),
    firstName: vine.string().trim().minLength(1).optional(),
    lastName: vine.string().trim().minLength(1).optional(),
    email: vine.string().trim().email().optional(),
    password: vine.string().minLength(6).optional(),
    isAdmin: vine.boolean().optional()
});

export const
    userToAdd = vine.compile(userToAddSchema),
    userToUpdate = vine.compile(userToUpdateSchema);

