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

export const readAllCategories = async () => {
    const categories = await prisma.category.findMany({
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
    await prisma.category.delete({
        where: { id }
    });
};

