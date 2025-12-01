import prisma from '../database/databaseORM.js';

export const createTransportLocation = async ({categoryId, vehicleId, address, latitude, longitude}) => {
    const transportLocation = await prisma.transportLocation.create({
        data: {
            categoryId: categoryId || null,
            vehicleId: vehicleId || null,
            address,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null
        },
        select: {
            id: true
        }
    });
    return transportLocation;
};

export const readTransportLocation = async (id) => {
    const transportLocation = await prisma.transportLocation.findUnique({
        where: { id },
        include: {
            category: true,
            vehicle: true
        }
    });
    return transportLocation;
};

export const readTransportLocations = async ({limit, offset, categoryId, search}) => {
    const where = {};
    
    if(categoryId){
        where.categoryId = parseInt(categoryId);
    }
    
    if(search){
        where.OR = [
            { address: { contains: search } },
            { category: { name: { contains: search } } }
        ];
    }
    
    const transportLocations = await prisma.transportLocation.findMany({
        where,
        include: {
            category: true,
            vehicle: true
        },
        orderBy: {
            id: 'asc'
        },
        take: limit ? parseInt(limit) : undefined,
        skip: offset ? parseInt(offset) : undefined
    });
    
    return transportLocations;
};

export const updateTransportLocation = async (id, {categoryId, vehicleId, address, latitude, longitude}) => {
    const updateData = {};
    
    if(categoryId !== undefined) updateData.categoryId = categoryId;
    if(vehicleId !== undefined) updateData.vehicleId = vehicleId;
    if(address !== undefined) updateData.address = address;
    if(latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null;
    if(longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null;
    
    if(Object.keys(updateData).length === 0) {
        throw new Error('No field given');
    }
    
    await prisma.transportLocation.update({
        where: { id },
        data: updateData
    });
};

export const deleteTransportLocation = async (id) => {
    await prisma.transportLocation.delete({
        where: { id }
    });
};

