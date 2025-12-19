import {hash} from '../../util/password.js';
import chalk from 'chalk';

const passwords = [
    {plain: 'password123', user: 'jean.dupont@mail.com'},
    {plain: 'password456', user: 'marie.martin@mail.com'}
];

console.log(chalk.blue("[HASH] Génération des hashs de mots de passe avec Argon2id...\n"));

for (const pwd of passwords) {
    const hashedPassword = await hash(pwd.plain);
    console.log(chalk.cyan(`Utilisateur: ${pwd.user}`));
    console.log(chalk.cyan(`Mot de passe: ${pwd.plain}`));
    console.log(chalk.cyan(`Hash: ${hashedPassword}\n`));
}

console.log(chalk.yellow("\n[HASH] Note: Les mots de passe sont maintenant hashés automatiquement lors du seed."));
console.log(chalk.yellow("[HASH] Utilisez 'npm run initDB' pour initialiser la base de données avec les données de test."));

