const bcrypt = require('bcrypt');
const validation = require('../_validation/index');
const dbFetch = require('../_config/index');
const jwt = require('jsonwebtoken')

const validateCredentials = async function (req,res,next) {
    if (!req.query['login_type']) {
        return res.http(400).log('You did not specify the type of login.')
    };
    validation.setSchema({
        username: ['string',false,3],
        password: ['string',true,5]
    });
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    }
    let record = await dbFetch.env(req.database,'/tables/credentials/query', 'POST', {
        filter: {
            $any: {
                username: req.body.username,
                email: req.body.username
            }
        }
    });
    if (record.data.message || record.error) {
        return res.http(400).log(record.data.message || record.error)
    };
    if (record.data.records.length !== 1) {
        return res.http(401).log('Username or Password is incorrect.')
    };
    let passwordCheck = await bcrypt.compare(req.body.password, record.data.records[0].password);
    if (!passwordCheck) {
        return res.http(401).log('Username or Password is incorrect.')
    };
    if (!record.data.records[0].roles.includes(req.query['login_type'])) {
        return res.http(403).log('Forbidden Access')
    };
    if (record.data.records[0].password_reset) {
        return res.http(401).log('Password requires a reset')
    };
    if (record.data.records[0].suspended) {
        return res.http(401).log('Account is Suspended')
    };
    let token = jwt.sign({
        id: record.data.records[0].id,
        scope: record.data.records[0].roles
    },process.env.JWT_SECRET_KEY,{expiresIn: '15m'});
    let refresh = jwt.sign({
        id: record.data.records[0].id,
        scope: record.data.records[0].roles
    },process.env.REFRESH_SECRET_KEY, {expiresIn: '4h'});
    res.cookie('jwt_refresh', refresh, {httpOnly: true,maxAge: 4 * 60 * 60 * 1000})
    return res.http(200).log({
        id: record.data.records[0].id,
        jwt: token
    })
};
module.exports = validateCredentials