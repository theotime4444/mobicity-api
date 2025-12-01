import {execSync} from "child_process";
import prisma from "../../database/databaseORM.js";
import {importCSVData} from "./importCSV.js";
import {seed} from "./seed.js";

try {
    console.log('🗄️  Initialisation de la base de données avec Prisma...\n');
    
    // Étape 1: Créer/mettre à jour la structure de la base de données depuis schema.prisma
    console.log('📐 Création de la structure de la base de données...');
    try {
                execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Structure de la base de données créée\n');
    } catch (error) {
        console.error('❌ Erreur lors de la création de la structure:', error.message);
        console.log('💡 Assurez-vous que Prisma est installé: npm install');
        throw error;
    }
    
    // Étape 2: Générer le client Prisma
    console.log('🔧 Génération du client Prisma...');
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Client Prisma généré\n');
    } catch (error) {
        console.error('❌ Erreur lors de la génération du client:', error.message);
        throw error;
    }
    
    // Étape 3: Seed des données initiales (catégories, véhicules, utilisateurs de test, etc.)
    await seed();
    
    // Étape 4: Importation des données CSV
    await importCSVData();
    
    console.log('\n✅ Initialisation complète !');
} catch (e) {
    console.error('❌ Erreur lors de l\'initialisation:', e);
    process.exit(1);
} finally {
    await prisma.$disconnect();
}

