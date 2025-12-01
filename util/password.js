import * as argon2 from 'argon2';
import 'dotenv/config';

/**
 * Hash un mot de passe avec Argon2id et le PEPPER
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} Hash du mot de passe
 */
export const hash = (password) => {
    if (!process.env.PASSWORD_PEPPER) {
        throw new Error('PASSWORD_PEPPER not set in environment variables');
    }
    return argon2.hash(password, {secret: Buffer.from(process.env.PASSWORD_PEPPER)});
};

/**
 * Compare un mot de passe en clair avec un hash
 * @param {string} plainText - Mot de passe en clair
 * @param {string} hash - Hash du mot de passe à comparer
 * @returns {Promise<boolean>} true si le mot de passe correspond, false sinon
 */
export const compare = (plainText, hash) => {
    if (!process.env.PASSWORD_PEPPER) {
        throw new Error('PASSWORD_PEPPER not set in environment variables');
    }
    return argon2.verify(
        hash,
        plainText,
        {secret: Buffer.from(process.env.PASSWORD_PEPPER)}
    );
};

