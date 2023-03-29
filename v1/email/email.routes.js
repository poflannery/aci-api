const { pushNoticeClient, pushNoticeEmployee, setEmailJob, removeEmailJob } = require('./email.controllers');

const emailRouter = require('express').Router();
//
//
//
//
//  
emailRouter.post('/client', pushNoticeClient);
emailRouter.post('/employee', pushNoticeEmployee);
emailRouter.post('/job', setEmailJob);
emailRouter.post('/:job/delete', removeEmailJob);
// send an email to client
// create an email job
// send an email to staff
//
//
module.exports = emailRouter