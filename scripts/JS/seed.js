import prisma from '../../database/databaseORM.js';
import {hash} from '../../util/password.js';
import chalk from 'chalk';

async function seed() {
    try {
        console.log(chalk.blue.bold('\n[SEED] Début du seed de la base de données...\n'));

        // Catégories
        console.log(chalk.cyan('[SEED] Création des catégories...'));
        await prisma.category.createMany({
            data: [
                { name: 'Arrêt de bus' },
                { name: 'Gare' },
                { name: 'Voiture partagée' }
            ],
            skipDuplicates: true
        });
        const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
        console.log(chalk.green('[SEED] Catégories créées\n'));

        // Véhicules
        console.log(chalk.cyan('[SEED] Création des véhicules...'));
        await prisma.vehicle.createMany({
            data: [
                { brand: 'Mercedes', model: 'Citaro' },
                { brand: 'Bombardier', model: 'TGV' },
                { brand: 'Renault', model: 'Zoe' }
            ],
            skipDuplicates: true
        });
        const vehicles = await prisma.vehicle.findMany({ orderBy: { id: 'asc' } });
        console.log(chalk.green('[SEED] Véhicules créés\n'));

        // Utilisateurs (avec mots de passe hashés)
        console.log(chalk.cyan('[SEED] Création des utilisateurs de test...'));
        const hashedPassword1 = await hash('password123');
        const hashedPassword2 = await hash('password456');
        
        const user1 = await prisma.user.upsert({
            where: { email: 'jean.dupont@mail.com' },
            update: {},
            create: {
                firstName: 'Dupont',
                lastName: 'Jean',
                email: 'jean.dupont@mail.com',
                password: hashedPassword1,
                isAdmin: false
            }
        });
        const user2 = await prisma.user.upsert({
            where: { email: 'marie.martin@mail.com' },
            update: {},
            create: {
                firstName: 'Martin',
                lastName: 'Marie',
                email: 'marie.martin@mail.com',
                password: hashedPassword2,
                isAdmin: true
            }
        });
        console.log(chalk.green('[SEED] Utilisateurs créés\n'));

        // Points de transport
        console.log(chalk.cyan('[SEED] Création des points de transport de test...'));
        await prisma.transportLocation.createMany({
            data: [
                {
                    categoryId: categories[0].id,
                    vehicleId: vehicles[0].id,
                    address: 'Place de la Gare, 5000 Namur',
                    latitude: 50.4674,
                    longitude: 4.8719
                },
                {
                    categoryId: categories[1].id,
                    vehicleId: vehicles[1].id,
                    address: 'Gare de Namur, 5000 Namur',
                    latitude: 50.4689,
                    longitude: 4.8708
                },
                {
                    categoryId: categories[2].id,
                    vehicleId: vehicles[2].id,
                    address: 'Rue de Bruxelles 45, 5000 Namur',
                    latitude: 50.4650,
                    longitude: 4.8720
                },
                {
                    categoryId: categories[0].id,
                    vehicleId: null,
                    address: 'Avenue de la Gare, 5000 Namur',
                    latitude: 50.4690,
                    longitude: 4.8710
                }
            ],
            skipDuplicates: true
        });
        const locations = await prisma.transportLocation.findMany({ orderBy: { id: 'asc' } });
        console.log(chalk.green('[SEED] Points de transport créés\n'));

        // Favoris
        console.log(chalk.cyan('[SEED] Création des favoris de test...'));
        await prisma.favorite.createMany({
            data: [
                {
                    userId: user1.id,
                    transportLocationId: locations[0].id
                },
                {
                    userId: user1.id,
                    transportLocationId: locations[1].id
                }
            ],
            skipDuplicates: true
        });
        console.log(chalk.green('[SEED] Favoris créés\n'));

        console.log(chalk.green.bold('[SEED] Seed terminé avec succès !'));
    } catch (error) {
        console.error(chalk.red.bold('[SEED] Erreur lors du seed:'), error);
        throw error;
    }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') ||
                     process.argv[1]?.includes('seed.js') ||
                     process.argv[1]?.endsWith('seed.js');

if (isMainModule) {
    seed()
        .then(async () => {
            await prisma.$disconnect();
            process.exit(0);
        })
        .catch(async (error) => {
            console.error(chalk.red.bold('[SEED] Erreur fatale:'), error);
            try {
                await prisma.$disconnect();
            } catch (e) {
                // Ignorer les erreurs de déconnexion
            }
            process.exit(1);
        });
}

export { seed };

