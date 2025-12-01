// Script pour générer les hashs de mots de passe
// Utilisation: node scripts/JS/hashPasswords.js
// Note: Les mots de passe sont maintenant hashés automatiquement dans seed.js

import {hash} from '../../util/password.js';

const passwords = [
    {plain: 'password123', user: 'jean.dupont@mail.com'},
    {plain: 'password456', user: 'marie.martin@mail.com'}
];

console.log("Génération des hashs de mots de passe avec Argon2id...\n");

for (const pwd of passwords) {
    const hashedPassword = await hash(pwd.plain);
    console.log(`Utilisateur: ${pwd.user}`);
    console.log(`Mot de passe: ${pwd.plain}`);
    console.log(`Hash: ${hashedPassword}\n`);
}

console.log("\n💡 Note: Les mots de passe sont maintenant hashés automatiquement lors du seed.");
console.log("   Utilisez 'npm run initDB' pour initialiser la base de données avec les données de test.");

