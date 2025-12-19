import * as vehicleModel from "../model/vehicle.js";
import chalk from "chalk";

export const getVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        const vehicle = await vehicleModel.readVehicle(id);
        if(vehicle){
            res.json(vehicle);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(chalk.red.bold('[VEHICLE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const getAllVehicles = async (req, res) => {
    try {
        const {search} = req.query;
        const vehicles = await vehicleModel.readAllVehicles({search});
        res.json(vehicles);
    } catch (err) {
        console.error(chalk.red.bold('[VEHICLE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const addVehicle = async (req, res) => {
    try {
        const {brand, model} = req.val;
        const vehicle = await vehicleModel.createVehicle({brand, model});
        res.status(201).json(vehicle);
    } catch (err) {
        console.error(chalk.red.bold('[VEHICLE] Erreur:'), err);
        res.sendStatus(500);
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const {brand, model, id} = req.val;
        await vehicleModel.updateVehicle(id, {brand, model});
        res.sendStatus(204);
    } catch (e) {
        console.error(chalk.red.bold('[VEHICLE] Erreur:'), e);
        if(e.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        const result = await vehicleModel.deleteVehicle(id);
        res.status(200).json(result);
    } catch (e) {
        console.error(chalk.red.bold('[VEHICLE] Erreur:'), e);
        if(e.message === 'Vehicle not found') {
            return res.sendStatus(404);
        }
        res.sendStatus(500);
    }
};

