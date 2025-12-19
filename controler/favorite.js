import * as favoriteModel from "../model/favorite.js";
import chalk from "chalk";

export const getMyFavorites = async (req, res) => {
    try {
        const userId = req.session.id; // Utilise automatiquement l'ID de la session
        const favorites = await favoriteModel.readFavoritesByUser(userId);
        res.json(favorites);
    } catch (err) {
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const addMyFavorite = async (req, res) => {
    try {
        const {transportLocationId} = req.val;
        const userId = req.session.id;
        const favorite = await favoriteModel.createFavorite({userId, transportLocationId});
        res.status(201).json(favorite);
    } catch (err) {
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
        if(err.code === 'P2002') {
            return res.status(409).json({error: "Ce favori existe déjà"});
        }
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const deleteMyFavorite = async (req, res) => {
    try {
        const transportLocationId = parseInt(req.params.transportLocationId);
        const userId = req.session.id;
        if(isNaN(transportLocationId)){
            return res.sendStatus(400);
        }
        await favoriteModel.deleteFavorite({userId, transportLocationId});
        res.sendStatus(204);
    } catch (e) {
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), e);
        res.sendStatus(500);
    }
};

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
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const getAllFavorites = async (req, res) => {
    try {
        const {limit = 50, offset = 0, userId} = req.query;
        const favorites = await favoriteModel.readAllFavorites({limit, offset, userId});
        res.json(favorites);
    } catch (err) {
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const addFavorite = async (req, res) => {
    try {
        const {userId, transportLocationId} = req.val;
        const favorite = await favoriteModel.createFavorite({userId, transportLocationId});
        res.status(201).json(favorite);
    } catch (err) {
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), err);
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
        console.error(chalk.red.bold('[FAVORITE] Erreur:'), e);
        res.sendStatus(500);
    }
};

