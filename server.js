// dependencies
const cookieParser = require('cookie-parser')
const express = require('express');
const v1Router = require('./v1/_masterRouter');
const httpResponse = require('./_services/HttpResponses');
const ValidateApiKey = require('./_middleware/ValidateApiKey');
const ValidateTenant = require('./_middleware/TenantCheck');
//
//
//
//
server = new express();// declare new express instance
require('dotenv').config(); // load environmental variables
server.use(express.json()); // data parsing
server.use(cookieParser()); // data parsing
server.use((req,res,next) => httpResponse(req,res,next)) // create response object for returning values
// api routes and version middleware
server.use('/api/v1/tenant/:tenant',[ValidateApiKey, ValidateTenant], v1Router) // Version 1
/* \
Routers will be written here for versions. 
When a version is deprecating, use middleware to provide notices.
\ */
// listen
server.listen(process.env.PORT,() => console.log(`Tá an freastalaí beo: Port ${process.env.PORT}`))