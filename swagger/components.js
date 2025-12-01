/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *          description: JWT token obtenu via /auth/login (valide 24h)
 *  
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
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
 *              isAdmin:
 *                  type: boolean
 *                  example: false
 *  
 *      Category:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *              name:
 *                  type: string
 *                  example: Arrêt de bus
 *  
 *      Vehicle:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
 *              brand:
 *                  type: string
 *                  example: Mercedes
 *              model:
 *                  type: string
 *                  example: Citaro
 *  
 *      TransportLocation:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  example: 1
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
 *                  example: 50.4674
 *              longitude:
 *                  type: number
 *                  example: 4.8719
 *              category:
 *                  $ref: '#/components/schemas/Category'
 *              vehicle:
 *                  $ref: '#/components/schemas/Vehicle'
 *  
 *      Favorite:
 *          type: object
 *          properties:
 *              userId:
 *                  type: integer
 *                  example: 1
 *              transportLocationId:
 *                  type: integer
 *                  example: 1
 *              transportLocation:
 *                  $ref: '#/components/schemas/TransportLocation'
 *  
 *      RegisterRequest:
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
 *  
 *  responses:
 *      UnauthorizedError:
 *          description: Unauthorized - Token manquant ou invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Unauthorized
 *  
 *      mustBeAdmin:
 *          description: Forbidden - L'utilisateur doit être admin pour accéder à cette ressource
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Forbidden - Admin access required
 */

