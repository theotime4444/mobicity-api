import * as transportLocationModel from "../model/transportLocation.js";

export const getTransportLocation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        const transportLocation = await transportLocationModel.readTransportLocation(id);
        if(transportLocation){
            res.json(transportLocation);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getTransportLocations = async (req, res) => {
    try {
        const {limit, offset, categoryId, search} = req.query;
        const transportLocations = await transportLocationModel.readTransportLocations({
            limit,
            offset,
            categoryId,
            search
        });
        res.json(transportLocations);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const addTransportLocation = async (req, res) => {
    try {
        const {categoryId, vehicleId, address, latitude, longitude} = req.val;
        const transportLocation = await transportLocationModel.createTransportLocation({
            categoryId,
            vehicleId,
            address,
            latitude,
            longitude
        });
        res.status(201).json(transportLocation);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const updateTransportLocation = async (req, res) => {
    try {
        const {categoryId, vehicleId, address, latitude, longitude, id} = req.val;
        await transportLocationModel.updateTransportLocation(id, {
            categoryId,
            vehicleId,
            address,
            latitude,
            longitude
        });
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        if(e.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const deleteTransportLocation = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        await transportLocationModel.deleteTransportLocation(id);
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

