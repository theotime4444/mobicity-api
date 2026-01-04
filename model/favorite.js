import prisma from '../database/databaseORM.js';

export const favoriteExists = async ({userId, transportLocationId}) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_transportLocationId: {
                userId,
                transportLocationId
            }
        }
    });
    return favorite !== null;
};

export const readFavoritesByUser = async (userId) => {
    const favorites = await prisma.favorite.findMany({
        where: {
            userId
        },
        include: {
            transportLocation: {
                include: {
                    category: true,
                    vehicle: true
                }
            }
        }
    });
    return favorites;
};

export const createFavorite = async ({userId, transportLocationId}) => {
    const favorite = await prisma.favorite.create({
        data: {
            userId,
            transportLocationId
        },
        select: {
            userId: true,
            transportLocationId: true
        }
    });
    return favorite;
};

export const deleteFavorite = async ({userId, transportLocationId}) => {
    await prisma.favorite.deleteMany({
        where: {
            userId,
            transportLocationId
        }
    });
};

export const readAllFavorites = async ({limit = 50, offset = 0, userId}) => {
    const where = {};
    if(userId) {
        where.userId = parseInt(userId);
    }
    
    const favorites = await prisma.favorite.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            transportLocation: {
                include: {
                    category: true,
                    vehicle: true
                }
            }
        },
        orderBy: {
            userId: 'asc'
        }
    });
    return favorites;
};

export const readFavoritesNearbyByUser = async (userId, {latitude, longitude, radius, limit = 50, categoryId, search}) => {
    // Récupérer les IDs des transport locations qui sont dans les favoris de l'utilisateur
    const userFavorites = await prisma.favorite.findMany({
        where: {
            userId: parseInt(userId)
        },
        select: {
            transportLocationId: true
        }
    });
    
    if (userFavorites.length === 0) {
        return [];
    }
    
    const transportLocationIds = userFavorites.map(f => f.transportLocationId);
    const idsList = transportLocationIds.join(',');
    
    let whereConditions = `tl.latitude IS NOT NULL AND tl.longitude IS NOT NULL AND tl.id IN (${idsList})`;
    
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
                userId: parseInt(userId),
                transportLocationId: parseInt(row.id),
                transportLocation: transportLocation,
                distance: parseFloat(row.distance)
            };
        })
    );
    
    return enrichedResults;
};

