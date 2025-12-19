import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import prisma from "../../database/databaseORM.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parse un fichier CSV et retourne un tableau d'objets
 * Gère les virgules dans les valeurs en utilisant un parsing simple mais robuste
 */
function parseCSV(filePath) {
    const content = readFileSync(filePath, {encoding: "utf-8"});
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        // Parser la ligne en tenant compte des virgules dans les valeurs
        // Format attendu : stop_id,stop_name,stop_lat,stop_lon
        // On split par virgule et on prend les 4 premiers éléments
        const parts = line.split(',');
        
        // Si on a exactement 4 parties, c'est simple
        if (parts.length === 4) {
            return {
                stop_id: parts[0].trim(),
                stop_name: parts[1].trim(),
                stop_lat: parts[2].trim(),
                stop_lon: parts[3].trim()
            };
        }
        
        // Sinon, on prend les parties de manière plus flexible
        // stop_id est toujours la première, stop_lat et stop_lon sont les 2 dernières
        const stop_id = parts[0].trim();
        const stop_lat = parts[parts.length - 2].trim();
        const stop_lon = parts[parts.length - 1].trim();
        // stop_name est tout ce qui est entre les deux
        const stop_name = parts.slice(1, parts.length - 2).join(',').trim();
        
        return {
            stop_id,
            stop_name,
            stop_lat,
            stop_lon
        };
    }).filter(row => row.stop_id && row.stop_lat && row.stop_lon); // Filtrer les lignes invalides
}

/**
 * Importe les arrêts de bus depuis stops_bus.csv avec insertion par lots
 */
async function importBusStops() {
    const csvPath = join(__dirname, '../data/stops_bus.csv');
    const stops = parseCSV(csvPath);
    
    // Récupérer la catégorie "Arrêt de bus" par son nom (plus fiable que l'ID)
    const busCategory = await prisma.category.findFirst({
        where: { name: 'Arrêt de bus' }
    });
    
    if (!busCategory) {
        throw new Error('Catégorie "Arrêt de bus" introuvable. Assurez-vous que le seed a été exécuté.');
    }
    
    console.log(`📦 Importation de ${stops.length} arrêts de bus...`);
    
    // Préparer les données pour l'insertion par lots
    const batchSize = 1000; // Insérer 1000 enregistrements à la fois
    let imported = 0;
    let errors = 0;
    
    // Traiter par lots
    for (let i = 0; i < stops.length; i += batchSize) {
        const batch = stops.slice(i, i + batchSize);
        
        // Préparer les données du lot
        const dataToInsert = batch.map(stop => ({
            categoryId: busCategory.id,
            address: stop.stop_name || null,
            latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
            longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
        })).filter(item => item.latitude !== null && item.longitude !== null); // Filtrer les données invalides
        
        try {
            // Insérer le lot en une seule requête
            await prisma.transportLocation.createMany({
                data: dataToInsert,
                skipDuplicates: true // Ignorer les doublons si nécessaire
            });
            imported += dataToInsert.length;
            
            // Afficher la progression tous les 5000 enregistrements
            if ((i + batchSize) % 5000 === 0 || i + batchSize >= stops.length) {
                console.log(`   Progression: ${Math.min(i + batchSize, stops.length)}/${stops.length} arrêts traités...`);
            }
        } catch (err) {
            // En cas d'erreur sur un lot, essayer d'insérer un par un pour identifier les problèmes
            console.error(`Erreur lors de l'importation du lot ${Math.floor(i / batchSize) + 1}:`, err.message);
            errors += batch.length;
            
            // Si trop d'erreurs, arrêter
            if (errors > 100) {
                console.error('⚠️  Trop d\'erreurs, arrêt de l\'importation');
                break;
            }
        }
    }
    
    console.log(`✅ ${imported} arrêts de bus importés, ${errors} erreurs`);
    return {imported, errors};
}

/**
 * Importe les arrêts de train depuis stops_train.csv avec insertion par lots
 */
async function importTrainStops() {
    const csvPath = join(__dirname, '../data/stops_train.csv');
    const stops = parseCSV(csvPath);
    
    // Récupérer la catégorie "Gare" par son nom (plus fiable que l'ID)
    const trainCategory = await prisma.category.findFirst({
        where: { name: 'Gare' }
    });
    
    if (!trainCategory) {
        throw new Error('Catégorie "Gare" introuvable. Assurez-vous que le seed a été exécuté.');
    }
    
    console.log(`🚂 Importation de ${stops.length} arrêts de train...`);
    
    // Préparer les données pour l'insertion par lots
    const batchSize = 1000; // Insérer 1000 enregistrements à la fois
    let imported = 0;
    let errors = 0;
    
    // Traiter par lots
    for (let i = 0; i < stops.length; i += batchSize) {
        const batch = stops.slice(i, i + batchSize);
        
        // Préparer les données du lot
        const dataToInsert = batch.map(stop => ({
            categoryId: trainCategory.id,
            address: stop.stop_name || null,
            latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
            longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
        })).filter(item => item.latitude !== null && item.longitude !== null); // Filtrer les données invalides
        
        try {
            // Insérer le lot en une seule requête
            await prisma.transportLocation.createMany({
                data: dataToInsert,
                skipDuplicates: true // Ignorer les doublons si nécessaire
            });
            imported += dataToInsert.length;
            
            // Afficher la progression tous les 5000 enregistrements
            if ((i + batchSize) % 5000 === 0 || i + batchSize >= stops.length) {
                console.log(`   Progression: ${Math.min(i + batchSize, stops.length)}/${stops.length} arrêts traités...`);
            }
        } catch (err) {
            // En cas d'erreur sur un lot, essayer d'insérer un par un pour identifier les problèmes
            console.error(`Erreur lors de l'importation du lot ${Math.floor(i / batchSize) + 1}:`, err.message);
            errors += batch.length;
            
            // Si trop d'erreurs, arrêter
            if (errors > 100) {
                console.error('⚠️  Trop d\'erreurs, arrêt de l\'importation');
                break;
            }
        }
    }
    
    console.log(`✅ ${imported} arrêts de train importés, ${errors} erreurs`);
    return {imported, errors};
}

/**
 * Fonction principale d'importation
 */
async function importCSVData() {
    try {
        console.log('🚀 Début de l\'importation des données CSV...\n');
        
        const busResult = await importBusStops();
        console.log('');
        const trainResult = await importTrainStops();
        
        console.log('\n📊 Résumé de l\'importation:');
        console.log(`   - Arrêts de bus: ${busResult.imported} importés, ${busResult.errors} erreurs`);
        console.log(`   - Arrêts de train: ${trainResult.imported} importés, ${trainResult.errors} erreurs`);
        console.log(`   - Total: ${busResult.imported + trainResult.imported} points de transport importés`);
        
        console.log('\n✅ Importation terminée !');
    } catch (err) {
        console.error('❌ Erreur lors de l\'importation:', err);
        throw err;
    }
    // Note: Ne pas fermer la connexion ici si appelé depuis initDB.js
    // La connexion sera fermée par initDB.js dans son bloc finally
}

// Exécuter si appelé directement (vérifie si le fichier est exécuté en ligne de commande)
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') || 
    process.argv[1]?.includes('importCSV.js')) {
    importCSVData()
        .then(async () => {
            // Fermer la connexion seulement si appelé directement
            await prisma.$disconnect();
            process.exit(0);
        })
        .catch(async (err) => {
            console.error(err);
            // Fermer la connexion en cas d'erreur aussi
            try {
                await prisma.$disconnect();
            } catch (e) {
                // Ignorer les erreurs de déconnexion
            }
            process.exit(1);
        });
}

export {importCSVData};

