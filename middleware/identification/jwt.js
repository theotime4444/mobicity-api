import {verify} from '../../util/jwt.js';

export const checkJWT = async (req, res, next) => {
    const authorize = req.get('authorization');
    if(authorize?.includes('Bearer')){
        const jwtEncoded = authorize.split(' ')[1];
        try {
            req.session = verify(jwtEncoded);
            next();
        } catch (e){
            res.status(401).send(e.message);
        }
    } else {
        res.status(401).send('No jwt');
    }
};

