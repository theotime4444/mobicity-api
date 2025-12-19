import * as userModel from "../model/user.js";
import chalk from "chalk";

export const getUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        const user = await userModel.readUser(id);
        if(user){
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const {id} = req.session;
        const user = await userModel.readUser(id);
        if(user){
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const addUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.val;
        
        const exists = await userModel.userExists({email});
        if(exists) {
            return res.status(409).json({error: "Cet email est déjà utilisé"});
        }
        
        const user = await userModel.createUser({firstName, lastName, email, password, isAdmin: false});
        res.status(201).json({
            ...user,
            message: "Inscription réussie"
        });
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        if(err.code === 'P2002') {
            return res.status(409).json({error: "Cet email est déjà utilisé"});
        }
        res.sendStatus(500);
    }
};

export const createUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password, isAdmin = false} = req.val;
        
        const exists = await userModel.userExists({email});
        if(exists) {
            return res.status(409).json({error: "Cet email est déjà utilisé"});
        }
        
        const user = await userModel.createUser({firstName, lastName, email, password, isAdmin});
        res.status(201).json(user);
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        if(err.code === 'P2002') {
            return res.status(409).json({error: "Cet email est déjà utilisé"});
        }
        res.sendStatus(500);
    }
};

export const updateUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password, isAdmin, id} = req.val;
        await userModel.updateUser(id, {firstName, lastName, email, password, isAdmin});
        res.sendStatus(204);
    } catch (e) {
        console.error(chalk.red.bold('[USER] Erreur:'), e);
        if(e.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const updateCurrentUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.val;
        
        const userId = req.session.id;
        
        await userModel.updateUser(userId, {firstName, lastName, email, password});
        res.sendStatus(204);
    } catch (e) {
        console.error(chalk.red.bold('[USER] Erreur:'), e);
        if(e.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const updateUserByAdmin = async (req, res) => {
    try {
        const {firstName, lastName, email, password, isAdmin, id} = req.val;
        await userModel.updateUser(id, {firstName, lastName, email, password, isAdmin});
        res.sendStatus(204);
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        if(err.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        await userModel.deleteUser(id);
        res.sendStatus(204);
    } catch (e) {
        console.error(chalk.red.bold('[USER] Erreur:'), e);
        res.sendStatus(500);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const {limit = 50, offset = 0, search} = req.query;
        const users = await userModel.readAllUsers({limit, offset, search});
        res.json(users);
    } catch (err) {
        console.error(chalk.red.bold('[USER] Erreur:'), err);
        res.sendStatus(500);
    }
};

