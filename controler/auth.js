import {readUserAuth} from "../model/user.js";
import jwt from "jsonwebtoken";
import chalk from "chalk";

/**
 * @swagger
 * components:
 *  schemas:
 *      LoginRequest:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  format: email
 *                  example: jean.dupont@mail.com
 *              password:
 *                  type: string
 *                  example: password123
 *      LoginResponse:
 *          type: object
 *          properties:
 *              token:
 *                  type: string
 *                  description: JWT token valid for 24 hours
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
    try {
        const {email, password} = req.val;
        
        const userAuth = await readUserAuth({email, password});
        
        if(userAuth.id) {
            const token = jwt.sign(
                {
                    id: userAuth.id,
                    email: userAuth.email,
                    isAdmin: userAuth.isAdmin
                },
                JWT_SECRET,
                {
                    expiresIn: '24h'
                }
            );
            
            res.json({token});
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.error(chalk.red.bold('[AUTH] Erreur:'), err);
        res.sendStatus(500);
    }
};

