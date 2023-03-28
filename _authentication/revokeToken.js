const dbFetch = require('../_config/index')


const revokeToken = async function (req,res,next) {
    if (!req.cookies['jwt_refresh']) {
        res.clearCookie('jwt_refresh')
        return res.http(200).log('')
    };
    res.clearCookie('jwt_refresh')
    return res.http(200).log('')
};



module.exports = revokeToken