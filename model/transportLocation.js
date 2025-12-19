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
            { address: { contains: search, mode: 'insensitive' } },
            { category: { name: { contains: search, mode: 'insensitive' } } }
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

export const readTransportLocationsNearby = async ({latitude, longitude, radius, limit = 50, categoryId, search}) => {
    let whereConditions = `tl.latitude IS NOT NULL AND tl.longitude IS NOT NULL`;
    
    if (categoryId) {
        whereConditions += ` AND tl.category_id = ${parseInt(categoryId)}`;
    }
    
    if (search) {
        const escapedSearch = search.replace(/'/g, "''").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
        whereConditions += ` AND tl.address ILIKE '%${escapedSearch}%'`;
    }
    let query = `
        SELECT 
            tl.id,
            tl.category_id as "categoryId",
            tl.vehicle_id as "vehicleId",
            tl.address,
            tl.latitude,
            tl.longitude,
            (
                6371 * acos(
                    GREATEST(-1, LEAST(1,
                        cos(radians(${parseFloat(latitude)}::numeric)) * 
                        cos(radians(tl.latitude::numeric)) * 
                        cos(radians(tl.longitude::numeric) - radians(${parseFloat(longitude)}::numeric)) + 
                        sin(radians(${parseFloat(latitude)}::numeric)) * 
                        sin(radians(tl.latitude::numeric))
                    ))
                )
            ) AS distance
        FROM transport_locations tl
        WHERE ${whereConditions}
    `;
    
    if (radius) {
        query = `
            SELECT * FROM (
                ${query}
            ) AS locations_with_distance
            WHERE distance <= ${parseFloat(radius)}
        `;
    }
    
    query += ` ORDER BY distance ASC LIMIT ${parseInt(limit)}`;
    
    const results = await prisma.$queryRawUnsafe(query);
    
    const enrichedResults = await Promise.all(
        results.map(async (row) => {
            const transportLocation = await prisma.transportLocation.findUnique({
                where: { id: parseInt(row.id) },
                include: {
                    category: true,
                    vehicle: true
                }
            });
            
            return {
                ...transportLocation,
                distance: parseFloat(row.distance)
            };
        })
    );
    
    return enrichedResults;
};

