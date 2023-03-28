const dbFetch = require('../../_config/index');
const validation = require('../../_validation/index');
//
//
//
//
//
//
const createTask = async function (req,res,next) {
    validation.setSchema({
        title: ['string',true,3],
        user_id: ['string',true,8],
        status: ['string',true,3],
        content: ['string',true,5],
        program: ['string',true,5],
        importance: ['number',true,0],
    });
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    };
    let record = await dbFetch.env(req.database, '/tables/tasks/data', 'POST', {
        title: req.body.title,
        user_id: req.body.user_id,
        status: req.body.status,
        content: req.body.content,
        program: req.body.program,
        importance: req.body.importance
    });
    if (record.error || record.data.message) {
        return res.http(500).log(record.error || record.data.message)
    }
    return res.http(200).log(record.data.id)
};
const updateTask = async function (req,res,next) {
    if (!req.params.task) {
        return res.http(400).log('Task Id is required')
    };
    let updates = req.body;
    let enumValues = ['title','user_id','status','content','program','importance'];
    let validEnums = false;
    Object.keys(updates).forEach(val => {
        if (!enumValues.includes(val)) {
            validEnums = val
        }
    });
    if (validEnums !== false) {
        return res.http(400).log(validEnums + ' is not an accepted field to update.')
    };
    let update = await dbFetch.env(req.database,`/tables/tasks/data/${req.params.task}`, 'PATCH', req.body)
    if (update.error || update.data.message) {
        return res.http(500).log(update.error || update.data.message)
    };
    return res.http(200).log(update.data)
};
const getTask = async function (req,res,next) {
    if (!req.params.task) {
        return res.http(400).log('Task Id is required')
    };
    let record = await dbFetch.env(req.database,'/tables/tasks/query', 'POST', {
        columns: ['*'],
        filter: {
            id: req.params.task
        }
    });
    console.log(record)
    if (record.error || record.data.message) {
        return res.http(500).log(update.error || update.data.message)
    };
    if (record.data.records.length == 0) {
        return res.http(404).log('No Task Found.');
    };
    return res.http(200).log(record.data.records[0])
};
const deleteTask = async function (req,res,next) {
    if (!req.params.task) {
        return res.http(400).log('Task Id is required')
    };
    await dbFetch.env(req.database,`/tables/tasks/data/${req.params.task}`, 'DELETE')
    res.http(200).log();
};
//
//
//
//
//
module.exports = {
    createTask,
    updateTask,
    getTask,
    deleteTask
}