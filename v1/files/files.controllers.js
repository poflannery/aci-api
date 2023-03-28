const dbFetch = require('../../_config/index')


const createFiles = async function (req,res,next) {
    if (!req.body.files) {
        return res.http(400).log('File list cannot be found in request.')
    };
    let list = req.body.files;
    let records = [];
    list.forEach(val => {
        records.push({
            name: val.name,
            user_id: req.headers['user_id'],
            status: 'Pending',
            path: `/${req.headers['user_id']}/${val.type.replace(" ","_")}/${val.name.replace(" ","_")}/`, // update this with the correct place - /user_id/type/file_name/
            notes: '',
            expiration: val.expiration
        });
    })
    let creation = await dbFetch.env(req.database,'/tables/files/bulk', 'POST', {
        records: records
    })
    if (creation.error || creation.data.message) {
        return res.http(500).log(creation.error || creation.data.message)
    }
    return res.http(200).log(creation.data)
};
const getFileList = async function (req,res,next) {
    let list = await dbFetch.env(req.database, '/tables/files/query', 'POST', {
        columns: ['*'],
        filter: {
            user_id: req.headers['user_id']
        }
    });
    if (list.error || list.data.message) {
        return res.http(500).log(list.error || list.data.message)
    };
    if (list.data.records.length == 0) {
        return res.http(404).log('No Records Found.')
    }
    return res.http(200).log(list.data.records)
};
const updateFile = async function (req,res,next) {
    if (!req.params.file) {
        return res.http(400).log('File Id is required')
    };
    let updates = req.body;
    let enumValues = ['name','user_id','status','path','notes','expiration'];
    let validEnums = false;
    let notesCheck;
    if (req.body.notes){
        let notesRecord = await dbFetch.env(req.database,`/tables/files/query`, 'POST', {
            columns: ['notes'],
            filter: {
                id: req.params.file
            }
        });
        
        if (notesRecord.error || notesRecord.data.message) {
           return notesCheck = true
        };
        if (notesRecord.data.records[0].notes === undefined || !notesRecord.data.records[0].notes || notesRecord.data.records[0].notes === "" || notesRecord.data.records[0].notes === null) {
            req.body.notes = JSON.stringify([req.body.notes])
        } else {
            let oldNotes = JSON.parse(notesRecord.data.records[0].notes);
            let newNotes = [...oldNotes,req.body.notes];
            req.body.notes = JSON.stringify(newNotes)
        }
    }
    if (notesCheck) {
        return res.http(500).log(notesRecord.error || notesRecord.data.message)
    };
    Object.keys(updates).forEach(val => {
        if (!enumValues.includes(val)) {
            validEnums = val
        }
    });
    if (validEnums !== false) {
        return res.http(400).log(validEnums + ' is not an accepted field to update.')
    }
    let recordNote = await dbFetch.env(req.database,`/tables/files/data/${req.params.file}`, 'PATCH', req.body)
    if (recordNote.error || recordNote.data.message) {
        return res.http(500).log(recordNote.error || recordNote.data.message)
    };
    return res.http(200).log(recordNote.data)
};
const deleteFile = async function (req,res,next) {
    if (!req.params.file) {
        return res.http(400).log('File Id is required')
    };
    await dbFetch.env(req.database,`/tables/files/data/${req.params.file}`,'DELETE');
    return res.http(200).log()
};
//
//
module.exports = {
    createFiles,
    getFileList,
    updateFile,
    deleteFile
}