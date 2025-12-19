import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import prisma from "../../database/databaseORM.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseCSV(filePath) {
    const content = readFileSync(filePath, {encoding: "utf-8"});
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const parts = line.split(',');
        
        if (parts.length === 4) {
            return {
                stop_id: parts[0].trim(),
                stop_name: parts[1].trim(),
                stop_lat: parts[2].trim(),
                stop_lon: parts[3].trim()
            };
        }
        
        const stop_id = parts[0].trim();
        const stop_lat = parts[parts.length - 2].trim();
        const stop_lon = parts[parts.length - 1].trim();
        const stop_name = parts.slice(1, parts.length - 2).join(',').trim();
        
        return {
            stop_id,
            stop_name,
            stop_lat,
            stop_lon
        };
    }).filter(row => row.stop_id && row.stop_lat && row.stop_lon);
}

async function importBusStops() {
    const csvPath = join(__dirname, '../data/stops_bus.csv');
    const stops = parseCSV(csvPath);
    
    const busCategory = await prisma.category.findFirst({
        where: { name: 'Arrêt de bus' }
    });
    
    if (!busCategory) {
        throw new Error('Catégorie "Arrêt de bus" introuvable. Assurez-vous que le seed a été exécuté.');
    }
    
    const batchSize = 1000;
    let imported = 0;
    let errors = 0;
    
    // Traiter par lots
    for (let i = 0; i < stops.length; i += batchSize) {
        const batch = stops.slice(i, i + batchSize);
        
        const dataToInsert = batch.map(stop => ({
            categoryId: busCategory.id,
            address: stop.stop_name || null,
            latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
            longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
        })).filter(item => item.latitude !== null && item.longitude !== null);
        
        try {
            await prisma.transportLocation.createMany({
                data: dataToInsert,
                skipDuplicates: true
            });
            imported += dataToInsert.length;
            
            if ((i + batchSize) % 5000 === 0 || i + batchSize >= stops.length) {
                console.log(chalk.cyan(`   Progression: ${Math.min(i + batchSize, stops.length)}/${stops.length} arrêts traités...`));
            }
        } catch (err) {
            console.error(chalk.red.bold(`[CSV] Erreur lors de l'importation du lot ${Math.floor(i / batchSize) + 1}:`), err.message);
            errors += batch.length;
            
            if (errors > 100) {
                console.error(chalk.red.bold('[CSV] Trop d\'erreurs, arrêt de l\'importation'));
                break;
            }
        }
    }
    
    console.log(chalk.green(`[CSV] ${imported} arrêts de bus importés, ${errors} erreurs`));
    return {imported, errors};
}

async function importTrainStops() {
    const csvPath = join(__dirname, '../data/stops_train.csv');
    const stops = parseCSV(csvPath);
    
    const trainCategory = await prisma.category.findFirst({
        where: { name: 'Gare' }
    });
    
    if (!trainCategory) {
        throw new Error('Catégorie "Gare" introuvable. Assurez-vous que le seed a été exécuté.');
    }
    
    const batchSize = 1000;
    let imported = 0;
    let errors = 0;
    
    // Traiter par lots
    for (let i = 0; i < stops.length; i += batchSize) {
        const batch = stops.slice(i, i + batchSize);
        
        const dataToInsert = batch.map(stop => ({
            categoryId: trainCategory.id,
            address: stop.stop_name || null,
            latitude: stop.stop_lat ? parseFloat(stop.stop_lat) : null,
            longitude: stop.stop_lon ? parseFloat(stop.stop_lon) : null
        })).filter(item => item.latitude !== null && item.longitude !== null);
        
        try {
            await prisma.transportLocation.createMany({
                data: dataToInsert,
                skipDuplicates: true
            });
            imported += dataToInsert.length;
            
            if ((i + batchSize) % 5000 === 0 || i + batchSize >= stops.length) {
                console.log(chalk.cyan(`   Progression: ${Math.min(i + batchSize, stops.length)}/${stops.length} arrêts traités...`));
            }
        } catch (err) {
            console.error(chalk.red.bold(`[CSV] Erreur lors de l'importation du lot ${Math.floor(i / batchSize) + 1}:`), err.message);
            errors += batch.length;
            
            if (errors > 100) {
                console.error(chalk.red.bold('[CSV] Trop d\'erreurs, arrêt de l\'importation'));
                break;
            }
        }
    }
    
    console.log(chalk.green(`[CSV] ${imported} arrêts de train importés, ${errors} erreurs`));
    return {imported, errors};
}

async function importCSVData() {
    try {
        console.log(chalk.blue.bold('[CSV] Début de l\'importation des données CSV...\n'));
        
        const busResult = await importBusStops();
        console.log('');
        const trainResult = await importTrainStops();
        
        console.log(chalk.cyan('\n[CSV] Résumé de l\'importation:'));
        console.log(chalk.cyan(`   - Arrêts de bus: ${busResult.imported} importés, ${busResult.errors} erreurs`));
        console.log(chalk.cyan(`   - Arrêts de train: ${trainResult.imported} importés, ${trainResult.errors} erreurs`));
        console.log(chalk.cyan(`   - Total: ${busResult.imported + trainResult.imported} points de transport importés`));
        
        console.log(chalk.green.bold('\n[CSV] Importation terminée !'));
    } catch (err) {
        console.error(chalk.red.bold('[CSV] Erreur lors de l\'importation:'), err);
        throw err;
    }
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') || 
    process.argv[1]?.includes('importCSV.js')) {
    importCSVData()
        .then(async () => {
            await prisma.$disconnect();
            process.exit(0);
        })
        .catch(async (err) => {
            console.error(chalk.red.bold('[CSV] Erreur fatale:'), err);
            try {
                await prisma.$disconnect();
            } catch (e) {
                // Ignorer les erreurs de déconnexion
            }
            process.exit(1);
        });
}

export {importCSVData};

