/* -------- Imports -------- */
const express = require('express');
const router = express.Router();
//
//
//
const authRouter = require('../_authentication/_router');
const supportRouter = require('./support/support.router');
const userRoutes = require('./users/users.routes');
const fileRouter = require('./files/files.router');
const taskRouter = require('./tasks/tasks.routes');
const searchRouter = require('./search/search.router');
const emailRouter = require('./email/email.routes');
//
//
/* -------- Middleware -------- */
const validateToken = require('../_authentication/validateToken');
//
//
//
/* -------- Routes -------- */
router.use('/auth', authRouter)
router.use('/support',[validateToken], supportRouter)
router.use('/users',[validateToken], userRoutes)
router.use('/files',[validateToken], fileRouter)
router.use('/tasks',[validateToken], taskRouter)
router.use('/search',[validateToken], searchRouter)
router.use('/push',[validateToken],emailRouter)
//
//
//
module.exports = router