const dbFetch = require('../_config/index')
module.exports = async function (req,res,next) {
    // validation of the api key sent via headers.
    if (!req.headers['x-api-key']) {
        return res.http(400).log('Invalid Api key found.')
    }
    let record = await dbFetch.master('/tables/subscription/query', 'POST', {
        filter: {
            "x-api-key":req.headers['x-api-key']
        }
    });
    if (record.error || record.data.message) {
        return res.http(500).log(record)
    };
    // validation of the host key is coming from.
    if (!record.data.records[0].whitelist.includes(req.hostname)){
        return res.http(401).log('Invalid request host.')
    }
    // save tenants for tenant check
    req.tenants = record.data.records[0].tenants;
    if (req.tenants === undefined) {
        return res.http(500).log('Error establishing tenants.')
    }
    next();
};