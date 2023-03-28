const dbFetch = require('../../_config/index')
const validation = require('../../_validation/index')
// all elements
const GetComments = async function (req,res,next) {
    let comments = await dbFetch.env(req.database, `/tables/articles/data/${req.params.article}`, 'GET')
    if (comments.data.message || comments.error) {
        return res.http(404).log('No Article Found.')
    };
    let commentsData = JSON.parse(comments.data.comments)
    return res.http(200).log(JSON.parse(commentsData))
};
const GetArticles = async function (req,res,next) {
    let records = await dbFetch.env(req.database, '/tables/articles/query', 'POST', {
        columns: ['*']
    })
    if (records.data.message || records.error) {
        return res.http(500).log('Error retrieving from database.')
    }
    return res.http(200).log(records.data.records)
};
const CreateArticles = async function (req,res,next) {
    validation.setSchema({
        title: ['string',true,3],
        summary: ['string',true,8],
        content: ['string',true,20]
    });
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    };
    let article = await dbFetch.env(req.database,'/tables/articles/data','POST', {
        title: req.body.title,
        content: req.body.content,
        summary: req.body.summary
    });
    if (article.error || article.data.message) {
        return res.http(500).log(article.error || article.data.message)
    };
    return res.http(200).log({article:article.data.id})
};
const GetQuestions = async function (req,res,next) {
    let questions = await dbFetch.env(req.database, '/tables/questions/query', 'POST', {
        columns: ['*']
    });
    if (questions.data.message || questions.error) {
        return res.http(500).log('Error retrieving from database.')
    };
    return res.http(200).log(questions.data.records)
};
const CreateQuestion = async function (req,res,next) {
    validation.setSchema({
        title: ['string',true,3],
        content: ['string',true,20]
    });
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    };
    let question = await dbFetch.env(req.database,'/tables/questions/data','POST', {
        title: req.body.title,
        content: req.body.content
    });
    if (question.error || question.data.message) {
        return res.http(500).log(question.error || question.data.message)
    };
    return res.http(200).log({question:question.data.id})
};
const GetTickets = async function (req,res,next) {
    let tickets = await dbFetch.env(req.database, '/tables/tickets/query', 'POST', {
        columns: ['*']
    });
    if (tickets.data.message || tickets.error) {
        return res.http(500).log('Error retrieving from database.')
    };
    return res.http(200).log(tickets.data.records)
};
// single element
const GrabArticle = async function (req,res,next) {
    let records = await dbFetch.env(req.database, `/tables/articles/data/${req.params.article}`, 'GET')
    if (records.data.message || records.error) {
        return res.http(404).log('No Article Found.')
    }
    
    return res.http(200).log(records.data)
};
const GrabTicket = async function (req,res,next) {
    let ticket = await dbFetch.env(req.database, `/tables/tickets/data/${req.params.ticket}`, 'GET')
    if (ticket.data.message || ticket.error) {
        return res.http(404).log('No Ticket Found.')
    }
    
    return res.http(200).log(ticket.data)
};
const CreateTicket = async function (req,res,next) {
    validation.setSchema({
        user_id: ['string',true,3],
        title: ['string',true,8],
        content: ['string',true,20]
    });
    if (!validation.execute(req.body).result) {
        return res.http(400).log(validation.execute(req.body).error)
    };
    let ticket = await dbFetch.env(req.database,'/tables/tickets/data','POST', {
        user_id: req.body.user_id,
        title: req.body.title,
        content: req.body.content,
        status: 'submitted'
    });
    if (ticket.error || ticket.data.message) {
        return res.http(500).log(ticket.error || ticket.data.message)
    };
    return res.http(200).log({ticket:ticket.data.id})
};
const UpdateTicket = async function(req,res,next) {
    let enumValues = ['title','content','user_id','status','comments'];
    let updates = req.body;
    let validEnums = false;
    let commentsCheck;
    if (req.body.comments){
        let commentsrecord = await dbFetch.env(req.database,`/tables/tickets/query`, 'POST', {
            columns: ['comments'],
            filter: {
                id: req.params.ticket
            }
        });
        
        if (commentsrecord.error || commentsrecord.data.message) {
           return commentsCheck = true
        };
        if (commentsrecord.data.records[0].comments === undefined || !commentsrecord.data.records[0].comments || commentsrecord.data.records[0].comments === "" || commentsrecord.data.records[0].comments === null) {
            req.body.comments = JSON.stringify([req.body.comments])
        } else {
            let oldComments = JSON.parse(commentsrecord.data.records[0].comments);
            let newComments = [...oldComments,req.body.comments];
            req.body.comments = JSON.stringify(newComments)
        }
    }
    if (commentsCheck) {
        return res.http(500).log(commentsrecord.error || commentsrecord.data.message)
    };
    Object.keys(updates).forEach(val => {
        if (!enumValues.includes(val)) {
            validEnums = val
        }
    });
    if (validEnums !== false) {
        return res.http(400).log(validEnums + ' is not an accepted field to update.')
    };
    let record = await dbFetch.env(req.database,`/tables/tickets/data/${req.params.ticket}`, 'PATCH', req.body)
    if (record.error || record.data.message) {
        return res.http(500).log(record.error || record.data.message)
    };
    return res.http(200).log(record.data)
};

module.exports = {
    GetComments,
    GetArticles,
    CreateArticles,
    GetQuestions,
    CreateQuestion,
    GetTickets,
    GrabArticle,
    GrabTicket,
    CreateTicket,
    UpdateTicket
}