import * as categoryModel from "../model/category.js";

export const getCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        const category = await categoryModel.readCategory(id);
        if(category){
            res.json(category);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.readAllCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const addCategory = async (req, res) => {
    try {
        const {name} = req.val;
        const category = await categoryModel.createCategory({name});
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const {name, id} = req.val;
        await categoryModel.updateCategory(id, {name});
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        if(e.message === 'No field given') {
            return res.sendStatus(400);
        }
        res.sendStatus(500);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if(isNaN(id)){
            res.sendStatus(400);
            return;
        }
        await categoryModel.deleteCategory(id);
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
};

