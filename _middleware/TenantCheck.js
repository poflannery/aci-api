const dbFetch = require('../_config/index')

module.exports = async function (req,res,next) {
    let tenants = req.tenants
    if (!tenants) {
        return res.http(500).log('Error retrieving tenants object.')
    };
    if (!tenants.includes(req.params['tenant']) || !req.params['tenant']) {
        return res.http(400).log('Bad Tenant Id.')
    };
    let record = await dbFetch.master('/tables/tenant/query', 'POST', {
        filter: {
            id: req.params['tenant']
        }
    });
    if (record.error || record.data.message || record.data.records.length !== 1) {
        return res.http(500).log(record)
    };
    req.database = record.data.records[0].db_path_id;
    if (!req.database) {
        return res.http(500).log('Error creating database path.')
    };
    next();
};