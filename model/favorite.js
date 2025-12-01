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

// Liste tous les favoris (admin)
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

