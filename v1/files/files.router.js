const { createFiles, getFileList, updateFile, deleteFile } = require('./files.controllers');
//
//
const fileRouter = require('express').Router();
//
//
//
fileRouter.post('/', createFiles);
fileRouter.put('/:file', updateFile);
fileRouter.delete('/:file', deleteFile);
fileRouter.get('/:user/list', getFileList);
// file download and upload will be taken care of on the front end with the microsoft graph client.
//
//
module.exports = fileRouter