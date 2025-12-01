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
 * Importe les arrêts de bus depuis stops_bus.csv
 */
async function importBusStops() {
    const csvPath = join(__dirname, '../data/stops_bus.csv');
    const stops = parseCSV(csvPath);
    
    console.log(`📦 Importation de ${stops.length} arrêts de bus...`);
    
    let imported = 0;
    let errors = 0;
    
    for (const stop of stops) {
        try {
            // Catégorie "Arrêt de bus" = id 1
            await prisma.transportLocation.create({
                data: {
                    categoryId: 1, // Arrêt de bus
                    address: stop.stop_name || null,
                    latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
                    longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
                }
            });
            imported++;
        } catch (err) {
            errors++;
            if (errors <= 5) { // Afficher seulement les 5 premières erreurs
                console.error(`Erreur lors de l'importation de ${stop.stop_name}:`, err.message);
            }
        }
    }
    
    console.log(`✅ ${imported} arrêts de bus importés, ${errors} erreurs`);
    return {imported, errors};
}

/**
 * Importe les arrêts de train depuis stops_train.csv
 */
async function importTrainStops() {
    const csvPath = join(__dirname, '../data/stops_train.csv');
    const stops = parseCSV(csvPath);
    
    console.log(`🚂 Importation de ${stops.length} arrêts de train...`);
    
    let imported = 0;
    let errors = 0;
    
    for (const stop of stops) {
        try {
            // Catégorie "Gare" = id 2
            await prisma.transportLocation.create({
                data: {
                    categoryId: 2, // Gare
                    address: stop.stop_name || null,
                    latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
                    longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
                }
            });
            imported++;
        } catch (err) {
            errors++;
            if (errors <= 5) { // Afficher seulement les 5 premières erreurs
                console.error(`Erreur lors de l'importation de ${stop.stop_name}:`, err.message);
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
    } finally {
        await prisma.$disconnect();
    }
}

// Exécuter si appelé directement (vérifie si le fichier est exécuté en ligne de commande)
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') || 
    process.argv[1]?.includes('importCSV.js')) {
    importCSVData()
        .then(() => {
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

export {importCSVData};

