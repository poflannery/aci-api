const jwt = require('jsonwebtoken');

const refreshToken = function (req,res,next) {
    if (!req.cookies['jwt_refresh']) {
        return res.http(401).log('Missing Refresh Cookie')
    };
    if (!req.headers['user_id']) {
        return res.http(401).log('Missing User Id')
    };
    let refresh = req.cookies['jwt_refresh']
    jwt.verify(refresh,process.env.REFRESH_SECRET_KEY, (err,decoded) => {
        if (err) {
            return res.http(401).log('Invalid Refresh JWT')
        }
        if (decoded.id !== req.headers['user_id']) {
            return res.http(401).log('IDs do not match')
        }
        let newToken = jwt.sign({
            id: decoded.id,
            scope: decoded.scope
        }, process.env.JWT_SECRET_KEY, {expiresIn: '15m'});
        return res.http(200).log({jwt:newToken})
    })
};



module.exports = refreshToken