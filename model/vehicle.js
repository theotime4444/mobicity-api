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

export const readAllVehicles = async ({search} = {}) => {
    const where = {};
    
    if(search){
        where.OR = [
            { brand: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } }
        ];
    }
    
    const vehicules = await prisma.vehicle.findMany({
        where,
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
    // Transaction pour garantir l'atomicité de la suppression
    return await prisma.$transaction(async (tx) => {
        // Vérifier que le Vehicle existe
        const vehicle = await tx.vehicle.findUnique({
            where: { id },
            include: {
                transportLocations: {
                    select: { id: true }
                }
            }
        });
        
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        
        // Compter les TransportLocation associés avant suppression
        const transportLocationCount = vehicle.transportLocations.length;
        
        // Supprimer le Vehicle (cascade automatique des TransportLocation via Prisma)
        await tx.vehicle.delete({
            where: { id }
        });
        
        // Retourner le nombre de TransportLocation supprimés
        return {
            deletedVehicle: true,
            deletedTransportLocations: transportLocationCount
        };
    });
};

