//
require('dotenv').config();
//
//
const express = require('express');
const cookieParser = require('cookie-parser');
const limiter = require('./_config/rateLimiter');
const cors = require('cors');
//
//
const v1Router = require('./v1/_masterRouter');
//
//
const httpResponse = require('./_services/HttpResponses');
const ValidateApiKey = require('./_middleware/ValidateApiKey');
const ValidateTenant = require('./_middleware/TenantCheck');
const corsOptions = require('./_config/cors');
//
//
server = new express();
//
//

server.use(express.json());
server.use(cookieParser());
server.use((req,res,next) => httpResponse(req,res,next))
//
//
//
server.use('*', cors(corsOptions))
server.use('/api/v1/tenant/:tenant',[limiter,ValidateApiKey, ValidateTenant], v1Router) // Version 1

//
//
//
//
server.listen(process.env.PORT,() => console.log(`Tá an freastalaí beo: Port ${process.env.PORT}`))