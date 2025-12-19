import {execSync} from "child_process";
import chalk from "chalk";

try {
    console.log(chalk.blue.bold('[INIT] Initialisation de la base de données avec Prisma...\n'));
    
    console.log(chalk.cyan('[INIT] Génération du client Prisma...'));
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log(chalk.green('[INIT] Client Prisma généré\n'));
    } catch (error) {
        console.error(chalk.red.bold('[INIT] Erreur lors de la génération du client:'), error.message);
        throw error;
    }
    
    const prisma = (await import("../../database/databaseORM.js")).default;
    const {importCSVData} = await import("./importCSV.js");
    const {seed} = await import("./seed.js");
    
    console.log(chalk.cyan('[INIT] Suppression de toutes les anciennes données...'));
    try {
        await prisma.$transaction(async (tx) => {
            await tx.favorite.deleteMany();
            await tx.transportLocation.deleteMany();
            await tx.user.deleteMany();
            await tx.category.deleteMany();
            await tx.vehicle.deleteMany();
        });
        console.log(chalk.green('[INIT] Toutes les anciennes données ont été supprimées'));
    } catch (error) {
        console.error(chalk.red.bold('[INIT] Erreur lors de la suppression des données:'), error.message);
        throw error;
    }
    
    // Réinitialisation des séquences d'auto-incrémentation
    console.log(chalk.cyan('[INIT] Réinitialisation des séquences d\'auto-incrémentation...'));
    try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE vehicles_id_seq RESTART WITH 1`);
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE transport_locations_id_seq RESTART WITH 1`);
        console.log(chalk.green('[INIT] Séquences réinitialisées\n'));
    } catch (error) {
        console.error(chalk.red.bold('[INIT] Erreur lors de la réinitialisation des séquences:'), error.message);
        throw error;
    }
    
    console.log(chalk.cyan('[INIT] Création de la structure de la base de données...'));
    try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log(chalk.green('[INIT] Structure de la base de données créée\n'));
    } catch (error) {
        console.error(chalk.red.bold('[INIT] Erreur lors de la création de la structure:'), error.message);
        console.log(chalk.yellow('[INIT] Assurez-vous que Prisma est installé: npm install'));
        throw error;
    }
    
    await seed();
    await importCSVData();
    
    console.log(chalk.green.bold('\n[INIT] Initialisation complète !'));
} catch (e) {
    console.error(chalk.red.bold('[INIT] Erreur lors de l\'initialisation:'), e);
    process.exit(1);
} finally {
    try {
        const prisma = (await import("../../database/databaseORM.js")).default;
        await prisma.$disconnect();
    } catch (e) {
        // Ignorer si le client n'a pas été généré
    }
}

