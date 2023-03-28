const userRoutes = require('express').Router();
//
//
const { GetUsersList, GetUser, UpdateUser, updateCredentials } = require('./users.controllers');
//
//
//
userRoutes.put('/credentials', updateCredentials);
userRoutes.post('/list', GetUsersList);
userRoutes.get('/:user/profile', GetUser);
userRoutes.put('/:user/profile', UpdateUser);
// suspend a user
// get roles and check privileges
// 
//
module.exports = userRoutes