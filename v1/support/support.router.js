/* -------- Imports -------- */
const express = require('express');
const { GetArticles, GrabArticle, GetComments, GetQuestions, GetTickets, GrabTicket, CreateTicket, UpdateTicket, CreateArticles, CreateQuestion } = require('./support.controllers');
const supportRouter = express.Router();

/* -------- Articles -------- */
supportRouter.post('/articles', CreateArticles);
supportRouter.get('/articles/list',GetArticles);
supportRouter.get('/articles/:article', GrabArticle);
supportRouter.get('/articles/:article/comments', GetComments);
// update article

/* -------- Questions -------- */
supportRouter.post('/questions', CreateQuestion);
supportRouter.get('/questions/list', GetQuestions);
// delete a question
// update a question

/* -------- Tickets -------- */
supportRouter.post('/tickets', CreateTicket);
supportRouter.get('/tickets/list', GetTickets);
supportRouter.get('/tickets/:ticket', GrabTicket);
supportRouter.put('/tickets/:ticket', UpdateTicket)

module.exports = supportRouter