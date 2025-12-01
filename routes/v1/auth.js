import {Router} from 'express';
import {login} from "../../controler/auth.js";
import {addUser} from "../../controler/user.js";
import {userValidatorMiddleware} from "../../middleware/validation.js";
import vine from '@vinejs/vine';

/**
 * @swagger
 * /v1/auth/login:
 *  post:
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginRequest'
 *      responses:
 *          200:
 *              description: Login successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/LoginResponse'
 *          400:
 *              description: Validation error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                              details:
 *                                  type: object
 *          401:
 *              description: Invalid credentials
 *          500:
 *              description: Error server
 */

const schema = vine.object({
    email: vine.string().email(),
    password: vine.string()
});

const validator = vine.compile(schema);

const validateLogin = async (req, res, next) => {
    try {
        const validated = await validator.validate(req.body);
        req.val = validated;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Validation error", details: error.messages});
    }
};

/**
 * @swagger
 * /v1/auth/register:
 *  post:
 *      tags:
 *          - Authentication
 *      summary: Register a new user
 *      description: Create a new user account with hashed password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterRequest'
 *      responses:
 *          201:
 *              description: User registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              firstName:
 *                                  type: string
 *                              lastName:
 *                                  type: string
 *                              email:
 *                                  type: string
 *                              message:
 *                                  type: string
 *          400:
 *              description: Validation error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                              details:
 *                                  type: object
 *          409:
 *              description: Email already exists
 *          500:
 *              description: Error server
 */

const router = Router();

router.post("/login", validateLogin, login);
router.post("/register", userValidatorMiddleware.create, addUser);

export default router;

