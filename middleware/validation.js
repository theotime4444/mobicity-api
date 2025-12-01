import * as userValidator from './validator/user.js';
import * as categoryValidator from './validator/category.js';
import * as vehicleValidator from './validator/vehicle.js';
import * as transportLocationValidator from './validator/transportLocation.js';
import * as favoriteValidator from './validator/favorite.js';

/**
 * @swagger
 * components:
 *  responses:
 *      ValidationError:
 *          description: the error(s) described
 *          content:
 *              text/plain:
 *                  schema:
 *                      type: string
 */

export const userValidatorMiddleware = {
    create: async (req, res, next) => {
        try {
            req.val = await userValidator.userToAdd.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    update: async (req, res, next) => {
        try {
            req.val = await userValidator.userToUpdate.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const categoryValidatorMiddleware = {
    create: async (req, res, next) => {
        try {
            req.val = await categoryValidator.categoryToAdd.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    update: async (req, res, next) => {
        try {
            req.val = await categoryValidator.categoryToUpdate.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const vehicleValidatorMiddleware = {
    create: async (req, res, next) => {
        try {
            req.val = await vehicleValidator.vehicleToAdd.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    update: async (req, res, next) => {
        try {
            req.val = await vehicleValidator.vehicleToUpdate.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const transportLocationValidatorMiddleware = {
    create: async (req, res, next) => {
        try {
            req.val = await transportLocationValidator.transportLocationToAdd.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    },
    update: async (req, res, next) => {
        try {
            req.val = await transportLocationValidator.transportLocationToUpdate.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};

export const favoriteValidatorMiddleware = {
    create: async (req, res, next) => {
        try {
            req.val = await favoriteValidator.favoriteToAdd.validate(req.body);
            next();
        } catch (e) {
            res.status(400).send(e.messages);
        }
    }
};
