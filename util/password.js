import * as argon2 from 'argon2';
import 'dotenv/config';

export const hash = (password) => {
    if (!process.env.PASSWORD_PEPPER) {
        throw new Error('PASSWORD_PEPPER not set in environment variables');
    }
    return argon2.hash(password, {secret: Buffer.from(process.env.PASSWORD_PEPPER)});
};

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

