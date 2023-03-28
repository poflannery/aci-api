const dbFetch = require('../../_config/index');
//
//
const searchRealtime = async function (req,res,next) {
    let resultLength = 10;
    if (req.query['length']) {
        resultLength = req.query['length']
    };
    if (!req.body.input){
        return res.http(400).log('Input is missing.')
    }
    let input = req.body.input;
    let articles = await dbFetch.env(req.database,'/tables/articles/query', 'POST', {
        columns: ['*']
    });
    if (articles.error || articles.data.message) {
        return res.http(500).log(articles.error || articles.data.message)
    }
    let glossary = await dbFetch.env(req.database,'/tables/glossary/query', 'POST', {
        columns: ['*']
    });
    if (glossary.error || glossary.data.message) {
        return res.http(500).log(glossary.error || glossary.data.message)
    }
    let questions = await dbFetch.env(req.database,'/tables/questions/query', 'POST', {
        columns: ['*']
    });
    if (questions.error || questions.data.message) {
        return res.http(500).log(questions.error || questions.data.message)
    }
    let data = [...articles.data.records,...glossary.data.records,...questions.data.records];
    let rawResults = [];
    data.forEach(val => {
        let lowercaseVal = val.title.toLowerCase();
        if (lowercaseVal.includes(input.toLowerCase())) {
            rawResults = [...rawResults,val]
        }
    });
    let results = rawResults.splice(0,resultLength)
    return res.http(200).log(results)
}; 


module.exports = {
    searchRealtime
}