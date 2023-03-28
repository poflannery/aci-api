const authRouter = require('express').Router();
//
//
const registerNewUser = require('./registerNewUser');
const revokeToken = require('./revokeToken');
const validateCredentials = require('./validateCredentials');
const refreshToken = require('./refreshToken');
const microsoftGraph = require('./microsoftGraph');
//
//
//
//
authRouter.post('/register-user', registerNewUser);
authRouter.post('/auth-request', validateCredentials);
authRouter.get('/refresh-token', refreshToken);
authRouter.delete('/revoke/:user', revokeToken);
authRouter.get('/azure-access', microsoftGraph);

module.exports = authRouter