import prisma from '../database/databaseORM.js';

export const createCategory = async ({name}) => {
    const category = await prisma.category.create({
        data: {
            name
        },
        select: {
            id: true
        }
    });
    return category;
};

export const readCategory = async (id) => {
    const categorie = await prisma.category.findUnique({
        where: { id }
    });
    return categorie;
};

export const readAllCategories = async ({search} = {}) => {
    const where = {};
    
    if(search){
        where.name = { contains: search, mode: 'insensitive' };
    }
    
    const categories = await prisma.category.findMany({
        where,
        orderBy: {
            id: 'asc'
        }
    });
    return categories;
};

export const updateCategory = async (id, {name}) => {
    const updateData = {};
    
    if(name !== undefined) updateData.name = name;
    
    if(Object.keys(updateData).length === 0) {
        throw new Error('No field given');
    }
    
    await prisma.category.update({
        where: { id },
        data: updateData
    });
};

export const deleteCategory = async (id) => {
    // Transaction pour garantir l'atomicité de la suppression
    return await prisma.$transaction(async (tx) => {
        // Vérifier que la Category existe
        const category = await tx.category.findUnique({
            where: { id },
            include: {
                transportLocations: {
                    select: { id: true }
                }
            }
        });
        
        if (!category) {
            throw new Error('Category not found');
        }
        
        // Compter les TransportLocation associés avant suppression
        const transportLocationCount = category.transportLocations.length;
        
        // Supprimer la Category (cascade automatique des TransportLocation via Prisma)
        await tx.category.delete({
            where: { id }
        });
        
        // Retourner le nombre de TransportLocation supprimés
        return {
            deletedCategory: true,
            deletedTransportLocations: transportLocationCount
        };
    });
};

