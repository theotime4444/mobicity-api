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

/**
 * Recherche géographique des points de transport les plus proches
 * Utilise la formule Haversine pour calculer la distance entre deux points sur une sphère
 * 
 * Formule Haversine :
 * distance = 6371 * acos(
 *   cos(radians(lat1)) * cos(radians(lat2)) * 
 *   cos(radians(lon2) - radians(lon1)) + 
 *   sin(radians(lat1)) * sin(radians(lat2))
 * )
 * 
 * @param {Object} params - Paramètres de recherche
 * @param {number} params.latitude - Latitude du point de référence
 * @param {number} params.longitude - Longitude du point de référence
 * @param {number} [params.radius] - Rayon maximum en kilomètres (optionnel)
 * @param {number} [params.limit=50] - Nombre maximum de résultats (défaut: 50)
 * @param {number} [params.categoryId] - Filtre par catégorie (optionnel)
 * @param {string} [params.search] - Recherche textuelle sur l'adresse (optionnel)
 * @returns {Promise<Array>} Liste des points de transport avec leur distance
 */
export const readTransportLocationsNearby = async ({latitude, longitude, radius, limit = 50, categoryId, search}) => {
    // Construction de la requête SQL avec formule Haversine
    // Utilisation de Prisma.$queryRawUnsafe avec échappement manuel pour sécurité
    let whereConditions = `tl.latitude IS NOT NULL AND tl.longitude IS NOT NULL`;
    const queryParams = [];
    
    // Ajouter le filtre par catégorie si fourni
    if (categoryId) {
        whereConditions += ` AND tl.category_id = ${parseInt(categoryId)}`;
    }
    
    // Ajouter le filtre de recherche textuelle si fourni (échappement pour éviter injection SQL)
    if (search) {
        // Échapper les caractères spéciaux SQL pour éviter l'injection
        const escapedSearch = search.replace(/'/g, "''").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
        whereConditions += ` AND tl.address ILIKE '%${escapedSearch}%'`;
    }
    
    // Construction de la requête avec formule Haversine
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
    
    // Filtrer par rayon si fourni
    if (radius) {
        query = `
            SELECT * FROM (
                ${query}
            ) AS locations_with_distance
            WHERE distance <= ${parseFloat(radius)}
        `;
    }
    
    // Trier par distance croissante et limiter
    query += ` ORDER BY distance ASC LIMIT ${parseInt(limit)}`;
    
    // Exécuter la requête (avec timeout géré par Prisma)
    const results = await prisma.$queryRawUnsafe(query);
    
    // Récupérer les relations category et vehicle pour chaque résultat
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

