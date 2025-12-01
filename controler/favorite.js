import * as favoriteModel from "../model/favorite.js";

// Pour route user (/favorite/me)
export const getMyFavorites = async (req, res) => {
    try {
        const userId = req.session.id; // Utilise automatiquement l'ID de la session
        const favorites = await favoriteModel.readFavoritesByUser(userId);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Pour route user (/favorite/me)
export const addMyFavorite = async (req, res) => {
    try {
        const {transportLocationId} = req.val; // Plus de userId dans le body
        const userId = req.session.id; // Utilise automatiquement l'ID de la session
        const favorite = await favoriteModel.createFavorite({userId, transportLocationId});
        res.status(201).json(favorite);
    } catch (err) {
        console.error(err);
        if(err.code === 'P2002') {
            return res.status(409).json({error: "Ce favori existe déjà"});
        }
        res.sendStatus(500);
    }
};

// Pour route user (/favorite/me/:transportLocationId)
export const deleteMyFavorite = async (req, res) => {
    try {
        const transportLocationId = parseInt(req.params.transportLocationId);
        const userId = req.session.id; // Utilise automatiquement l'ID de la session
        if(isNaN(transportLocationId)){
            return res.sendStatus(400);
        }
        await favoriteModel.deleteFavorite({userId, transportLocationId});
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

// Pour route admin (/admin/favorites/users/:userId)
export const getFavoritesByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if(isNaN(userId)){
            res.sendStatus(400);
            return;
        }
        const favorites = await favoriteModel.readFavoritesByUser(userId);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Pour route admin (liste tous les favoris)
export const getAllFavorites = async (req, res) => {
    try {
        const {limit = 50, offset = 0, userId} = req.query;
        const favorites = await favoriteModel.readAllFavorites({limit, offset, userId});
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Anciennes fonctions (gardées pour compatibilité si nécessaire)
export const addFavorite = async (req, res) => {
    try {
        const {userId, transportLocationId} = req.val;
        const favorite = await favoriteModel.createFavorite({userId, transportLocationId});
        res.status(201).json(favorite);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deleteFavorite = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const transportLocationId = parseInt(req.params.transportLocationId);
        if(isNaN(userId) || isNaN(transportLocationId)){
            res.sendStatus(400);
            return;
        }
        await favoriteModel.deleteFavorite({userId, transportLocationId});
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

