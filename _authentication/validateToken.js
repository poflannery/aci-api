const jwt = require('jsonwebtoken');

const validateToken = async function (req,res,next) {
    if (!req.headers['authorization']) {
        return res.http(401).log('Unauthorized')
    };
    if (!req.headers['user_id']) {
        return res.http(401).log('Unauthorized')
    };
    let bearer = req.headers['authorization'].split(" ")[1]
    if (!bearer) {
        return res.http(401).log('Unauthorized')
    };
    jwt.verify(bearer, process.env.JWT_SECRET_KEY, (err,decoded) => {
        if (err) {
            return res.http(401).log('Unauthorized')
        }
        if (decoded.id !== req.headers['user_id']) {
            return res.http(401).log('Unauthorized')
        }
        next()
    })
};
module.exports = validateToken