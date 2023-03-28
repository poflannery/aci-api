const validation = require('../_validation/index')
const dbFetch = require('../_config/index');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const graph = require('../_config/microsoftGraph');

/*
Later, include the feature to use multiple extensions of an email. 
Use a variable to obtain the email domain.... let domain = '@AdoptionChoice.onmicrosoft.com';
this means the client will EITHER ask for full then split the string at '@' or ask for only the beginning and provide options for the domain.
This will help with quality controlling the email and it will allow us to have perfect casing when storing the email address.
This also means we have to enforce no @ symbols with the username on the client side to prevent emails used for the username...maybe.
*/

const registerNewUser = async function (req,res,next) {
    if (!req.query['account_type']) {
        return res.http(400).log('Account type query not set.')
    };
    if (req.query['account_type'] !== 'Client' && req.query['account_type'] !== 'Employee' && req.query['account_type'] !== 'Super') {
        return res.http(400).log('Account Type is not valid.')
    };
    if (req.query['account_type'] === 'Client') {
        validation.setSchema({
            username: ['string',true,3],
            password: ['string',true,5],
            email: ['string',true,1],
            domain: ['string',true,5],
            security_question: ['string',true,1],
            security_answer: ['string',true,1],
            user_type: ['string',true,0],
            adoption_type: ['string',true,0],
            account_status: ['string',true,0],
            counselor_id: ['number',true,0],
            location: ['string',false,0],
            contact: ['object',true,0],
            first_name: ['string',true,0],
            middle_name: ['string',false,0],
            last_name: ['string',true,0],
            full_name: ['string',true,0],
            family_name: ['string',true,1],
            applicants: ['object',false,0],
            children: ['object',false,0],
            pets: ['object',false,0],
            notes: ['object',false,0],
            biography: ['string',false,0],
            storage_path: ['string',true,0],
            roles: ['object',true,0]
        });
    }
    if (req.query['account_type'] === 'Employee') {
        validation.setSchema({
            username: ['string',true,3],
            password: ['string',true,5],
            email: ['string',true,1],
            domain: ['string',true,5],
            security_question: ['string',true,1],
            security_answer: ['string',true,1],
            user_type: ['string',true,0],
            adoption_type: ['string',false,0],
            account_status: ['string',false,0],
            counselor_id: ['number',true,0],
            location: ['string',true,0],
            contact: ['object',false,0],
            first_name: ['string',true,0],
            middle_name: ['string',false,0],
            last_name: ['string',true,0],
            full_name: ['string',true,0],
            family_name: ['string',true,1],
            applicants: ['object',false,0],
            children: ['object',false,0],
            pets: ['object',false,0],
            notes: ['object',false,0],
            biography: ['string',true,0],
            storage_path: ['string',true,0],
            roles: ['object',true,0]
        });
    }
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    };
    let email = req.body.email + req.body.domain;
    let record = await dbFetch.env(req.database, '/tables/credentials/query', 'POST', {
        filter: {
            $any: {
                username: req.body.username,
                email: email
            }
            
        }
    });
    if (record.data.message || record.error) {
        return res.http(500).log(record.data.message || record.error)
    };
    if (record.data.records.length !== 0 && record.data.records[0].username == req.body.username) {
        return res.http(409).log('Username already taken.')
    };
    if (record.data.records.length !== 0 && record.data.records[0].email == email) {
        return res.http(409).log('Email already taken.')
    };
    let grabCredentials = await graph.api('/users').get();
    let userID;
    grabCredentials.value.forEach((val) => {
        if (val.mail === null){
            return
        }
        if (val['mail'] == email){
            userID = val.id
            req.body.email = val.mail
            return
        }
    });
    if (!userID) {
        return res.http(404).log('Your account cannot be located in the organization directory.')
    }
    let password = await bcrypt.hash(req.body.password, 10)
    let sec_answer = await bcrypt.hash(req.body.security_answer, 10)
    let sec_question = await bcrypt.hash(req.body.security_question, 10)
    let createRecord = await dbFetch.env(req.database, `/tables/credentials/data/${userID}`, 'POST', {
        username: req.body.username,
        password: password,
        email: email,
        security_question: sec_question,
        security_answer: sec_answer,
        roles: req.body.roles
    });
    if (createRecord.data.message || createRecord.error) {
        return res.http(500).log(createRecord.error || createRecord.data.message)
    };
    let createProfile = await dbFetch.env(req.database, `/tables/profiles/data/${userID}`, 'POST', {
        user_type: req.body.user_type,
        adoption_type: req.body.adoption_type,
        account_status: req.body.account_status,
        counselor_id: req.body.counselor_id,
        location: req.body.location,
        contact: JSON.stringify(req.body.contact) || "",
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        full_name: req.body.full_name,
        family_name: req.body.family_name,
        applicants: JSON.stringify(req.body.applicants) || "",
        children: JSON.stringify(req.body.children) || "",
        pets: JSON.stringify(req.body.pets) || "",
        notes: JSON.stringify(req.body.notes) || "",
        biography: req.body.biography,
        storage_path: req.body.storage_path
    });
    if (createProfile.data.message || createProfile.error) {
        return res.http(500).log(createProfile.error || createProfile.data.message)
    };
    return res.http(200).log({id:userID})
};
module.exports = registerNewUser