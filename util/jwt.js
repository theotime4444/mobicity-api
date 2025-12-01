import 'dotenv/config.js';
import jsonwebtoken from 'jsonwebtoken';

export const sign = (payload, options) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, options);
};

export const verify = (jwt, options = {}) => {
  return jsonwebtoken.verify(jwt, process.env.JWT_SECRET, options);
};