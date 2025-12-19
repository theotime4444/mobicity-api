export const admin = (req, res, next) => {
    if(req.session && req.session.isAdmin === true){
        next();
    } else {
        res.sendStatus(403);
    }
};

