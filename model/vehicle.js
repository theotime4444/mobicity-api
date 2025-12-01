import prisma from '../database/databaseORM.js';

export const createVehicle = async ({brand, model}) => {
    const vehicle = await prisma.vehicle.create({
        data: {
            brand,
            model
        },
        select: {
            id: true
        }
    });
    return vehicle;
};

export const readVehicle = async (id) => {
    const vehicule = await prisma.vehicle.findUnique({
        where: { id }
    });
    return vehicule;
};

export const readAllVehicles = async () => {
    const vehicules = await prisma.vehicle.findMany({
        orderBy: {
            id: 'asc'
        }
    });
    return vehicules;
};

export const updateVehicle = async (id, {brand, model}) => {
    const updateData = {};
    
    if(brand !== undefined) updateData.brand = brand;
    if(model !== undefined) updateData.model = model;
    
    if(Object.keys(updateData).length === 0) {
        throw new Error('No field given');
    }
    
    await prisma.vehicle.update({
        where: { id },
        data: updateData
    });
};

export const deleteVehicle = async (id) => {
    await prisma.vehicle.delete({
        where: { id }
    });
};

