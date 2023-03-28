const { createTask, updateTask, getTask, deleteTask } = require('./tasks.controllers');

const taskRouter = require('express').Router();
//
//
//
//
taskRouter.post('/', createTask);
taskRouter.put('/:task', updateTask);
taskRouter.get('/:task', getTask);
taskRouter.delete('/:task', deleteTask);
// 
// 
//
//
module.exports = taskRouter