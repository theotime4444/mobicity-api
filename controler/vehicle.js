import * as vehicleModel from "../model/vehicle.js";

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
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleModel.readAllVehicles();
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const addVehicle = async (req, res) => {
    try {
        const {brand, model} = req.val;
        const vehicle = await vehicleModel.createVehicle({brand, model});
        res.status(201).json(vehicle);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const {brand, model, id} = req.val;
        await vehicleModel.updateVehicle(id, {brand, model});
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
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
        await vehicleModel.deleteVehicle(id);
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

