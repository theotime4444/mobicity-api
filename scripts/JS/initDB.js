import {execSync} from "child_process";

try {
    console.log('🗄️  Initialisation de la base de données avec Prisma...\n');
    
    // Étape 1: Générer le client Prisma (nécessaire avant d'utiliser Prisma)
    console.log('🔧 Génération du client Prisma...');
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Client Prisma généré\n');
    } catch (error) {
        console.error('❌ Erreur lors de la génération du client:', error.message);
        throw error;
    }
    
    // IMPORTANT: Importer les modules APRÈS la génération du client Prisma
    // car ils utilisent databaseORM.js qui crée un PrismaClient
    const prisma = (await import("../../database/databaseORM.js")).default;
    const {importCSVData} = await import("./importCSV.js");
    const {seed} = await import("./seed.js");
    
    // Étape 2: Supprimer TOUTES les anciennes données avant d'insérer les nouvelles
    console.log('🗑️  Suppression de toutes les anciennes données...');
    try {
        // Utiliser une transaction pour garantir l'atomicité
        // Ordre de suppression respectant les clés étrangères :
        // 1. Favoris (dépend de User et TransportLocation)
        // 2. TransportLocations (dépend de Category et Vehicle)
        // 3. Users (indépendant)
        // 4. Categories (indépendant)
        // 5. Vehicles (indépendant)
        await prisma.$transaction(async (tx) => {
            await tx.favorite.deleteMany();
            await tx.transportLocation.deleteMany();
            await tx.user.deleteMany();
            await tx.category.deleteMany();
            await tx.vehicle.deleteMany();
        });
        console.log('✅ Toutes les anciennes données ont été supprimées\n');
    } catch (error) {
        console.error('❌ Erreur lors de la suppression des données:', error.message);
        throw error;
    }
    
    // Étape 3: Créer/mettre à jour la structure de la base de données depuis schema.prisma
    // (sur une base maintenant vide)
    console.log('📐 Création de la structure de la base de données...');
    try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Structure de la base de données créée\n');
    } catch (error) {
        console.error('❌ Erreur lors de la création de la structure:', error.message);
        console.log('💡 Assurez-vous que Prisma est installé: npm install');
        throw error;
    }
    
    // Étape 4: Seed des données initiales (catégories, véhicules, utilisateurs de test, etc.)
    await seed();
    
    // Étape 5: Importation des données CSV
    await importCSVData();
    
    console.log('\n✅ Initialisation complète !');
} catch (e) {
    console.error('❌ Erreur lors de l\'initialisation:', e);
    process.exit(1);
} finally {
    // Importer prisma seulement si le client a été généré
    try {
        const prisma = (await import("../../database/databaseORM.js")).default;
        await prisma.$disconnect();
    } catch (e) {
        // Ignorer si le client n'a pas été généré
    }
}

