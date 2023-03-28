const dbFetch = require('../../_config/index')
const jwt = require('jsonwebtoken')
const validation = require('../../_validation/index')
const bcrypt = require('bcrypt')
//
//
//
//
const GetUsersList = async function (req,res,next) {
    let enumValues = ['birthMother', 'adoptiveFamily','client','counselor','administrator','management','developer','employee']
    if (!req.query['account_type']) {
        return res.http(400).log('Account type not specified.')
    };
    if (!enumValues.includes(req.query['account_type'])) {
        return res.http(400).log(req.query['account_type'] + ' is not an accepted value. Please double check spelling and casing, and review enum values.')
    };
    let accountType = req.query['account_type'];
    let type = 
        accountType === 'birthMother' ? ['Birth Mother'] :
        accountType === 'adoptiveFamily' ? ['Adoptive Family'] :
        accountType === 'client' ? ['Birth Mother', 'Adoptive Family'] :
        accountType === 'counselor' ? ['Counselor'] :
        accountType === 'administrator' ? ['Administrator'] :
        accountType === 'management' ? ['Management'] :
        accountType === 'developer' ? ['Developer'] :
        accountType === 'employee' ? ['Counselor', 'Administrator', 'Management', 'Developer'] : null

    let data = await dbFetch.env(req.database, '/tables/profiles/query', 'POST', {
        columns: ['*'],
        filter: {
            user_type: {
                $any: type
            }
        }
    });
    if (data.data.message || data.error) {
        return res.http(500).log(data.data.message || data.error)
    };
    if (data.data.records.length == 0) {
        return res.http(404).log('No records located.')
    };
    return res.http(200).log(data.data.records)
};
//
const GetUser = async function (req,res,next) {
    if (!req.params.user) {
        return res.http(400).log('No user id specified.')
    };
    let userID = req.params.user;
    let record = await dbFetch.env(req.database, `/tables/profiles/data/${userID}`, 'GET');
    if (record.data.message || record.error) {
        return res.http(500).log(record.data.message || record.error)
    };
    if (!record.data) {
        return res.http(404).log('No record found.')
    };
    return res.http(200).log(record.data)
};
//
const UpdateUser = async function (req,res,next) {
    if (!req.params.user) {
        return res.http(400).log('No user id specified.')
    };
    let userID = req.params.user;
    let updates = req.body;
    let enumValues = ['user_type','adoption_type','account_status','counselor_id','location','contact','first_name','middle_name','last_name','full_name','family_name','applicants','children','pets','notes','biography','storage_path'];
    let validEnums = false;
    Object.keys(updates).forEach(val => {
        if (!enumValues.includes(val)) {
            validEnums = val
        }
    });
    if (validEnums !== false) {
        return res.http(400).log(validEnums + ' is not an accepted field to update.')
    }
    let record = await dbFetch.env(req.database,`/tables/profiles/data/${userID}`, 'PATCH', req.body)
    if (record.error || record.data.message) {
        return res.http(500).log(record.error || record.data.message)
    };
    return res.http(200).log('Profile Updated')

};
const updateCredentials = async function (req,res,next) {
    if (!req.cookies['jwt_refresh']) {
        return res.http(401).log()
    };
    if (!req.query['update_type']){
        return res.http(400).log()
    }
    if (req.query['update_type'] !== 'password' && req.query['update_type'] !== 'username'){
        return res.http(400).log()
    }
    let token = req.cookies['jwt_refresh']
    if (!token){
        return res.http(401).log()
    }
    let decoded = jwt.decode(token)
    if (decoded.id !== req.headers['user_id']) {
        return res.http(401).log()
    }
    if (req.query['update_type'] === 'password') {
        validation.setSchema({
            password: ['string',true,5],
            newPassword: ['string',true,5]
        })
    };
    if (req.query['update_type'] === 'username') {
        validation.setSchema({
            password: ['string',true,5],
            newUsername: ['string',true,3]
        })
    };
    if (!validation.execute(req.body).result){
        return res.http(400).log(validation.execute(req.body).error)
    }
    let current = await dbFetch.env(req.database, '/tables/credentials/query', 'POST', {
        columns: ['*'],
        filter: {
            id: decoded.id
        }
    });
    if (current.error || current.data.message){
        return res.http(500).log(current.error || current.data.message)
    };
    if (current.data.records.length == 0) {
        return res.http(404).log('User Account Not Found.')
    };
    let passwordCheck = await bcrypt.compare(req.body.password,current.data.records[0].password)
    if (!passwordCheck) {
        return res.http(401).log()
    }
    if (req.query['update_type'] === 'password') {
        let updatedPassword = await bcrypt.hash(req.body.newPassword,10);
        let update = await dbFetch.env(req.database, `/tables/credentials/data/${decoded.id}`,'PATCH', {
            password: updatedPassword
        });
        if (update.error || update.data.message){
            return res.http(500).log(update.error || update.data.message)
        };
        return res.http(200).log()
    }
    if (req.query['update_type'] === 'username') {
        let update = await dbFetch.env(req.database, `/tables/credentials/data/${decoded.id}`,'PATCH', {
            username: req.body.newUsername
        });
        if (update.error || update.data.message){
            return res.http(500).log(update.error || update.data.message)
        };
        return res.http(200).log()
    }
};
//
//
//
module.exports = {
    GetUsersList,
    GetUser,
    UpdateUser,
    updateCredentials
}

