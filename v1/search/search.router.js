const searchRouter = require('express').Router();
//
//
//
//
const { searchRealtime } = require('./search.controllers');
//
//
//
searchRouter.post('/', searchRealtime)
//
//
//
module.exports = searchRouter