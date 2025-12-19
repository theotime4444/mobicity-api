import prisma from '../database/databaseORM.js';
import {hash, compare} from '../util/password.js';

export const userExists = async ({email}) => {
    const utilisateur = await prisma.user.findUnique({
        where: { email }
    });
    return utilisateur !== null;
};

export const createUser = async ({firstName, lastName, email, password, isAdmin = false}) => {
    const hashedPassword = await hash(password);
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true
        }
    });
    return user;
};

export const readUserByEmail = async ({email}) => {
    const utilisateur = await prisma.user.findUnique({
        where: { email }
    });
    return utilisateur;
};

export const readUser = async (id) => {
    const utilisateur = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true
        }
    });
    return utilisateur;
};

export const updateUser = async (id, {firstName, lastName, email, password, isAdmin}) => {
    const updateData = {};
    
    if(firstName !== undefined) updateData.firstName = firstName;
    if(lastName !== undefined) updateData.lastName = lastName;
    if(email !== undefined) updateData.email = email;
    if(password !== undefined) {
        updateData.password = await hash(password);
    }
    if(isAdmin !== undefined) updateData.isAdmin = isAdmin;
    
    if(Object.keys(updateData).length === 0) {
        throw new Error('No field given');
    }
    
    await prisma.user.update({
        where: { id },
        data: updateData
    });
};

export const deleteUser = async (id) => {
    await prisma.user.delete({
        where: { id }
    });
};

export const readAllUsers = async ({limit = 50, offset = 0, search}) => {
    const where = {};
    
    if(search){
        where.OR = [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ];
    }
    
    const users = await prisma.user.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true
        },
        orderBy: {
            id: 'asc'
        }
    });
    return users;
};

export const readUserAuth = async ({email, password}) => {
    const utilisateur = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (utilisateur && utilisateur.password) {
        try {
            const isValid = await compare(password, utilisateur.password);
            
            if (isValid) {
                return {
                    id: utilisateur.id,
                    isAdmin: utilisateur.isAdmin,
                    email: utilisateur.email
                };
            } else {
                return {id: null, isAdmin: null};
            }
        } catch (err) {
            return {id: null, isAdmin: null};
        }
    } else {
        return {id: null, isAdmin: null};
    }
};
