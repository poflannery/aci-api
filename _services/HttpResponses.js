const dbFetch = require('../_config/index')

module.exports = function (req,res,next) {
    res.http = function (code) {
        return res.status(code)
    };
    res.log = async function (data) {
        const message = {
            200: 'Ok',
            201: 'Created',
            202: 'Accepted',
            204: 'No Content',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            415: 'Unsupported Media Type',
            422: 'Unprocessable Entity',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            503: 'Service Unavailable'
        }
        const tags = {
            200: ['Success','Pass'],
            201: ['Resource','New','Created'],
            202: ['Accepted'],
            204: ['No Content'],
            307: ['Temporary Redirect'],
            308: ['Permanent Redirect'],
            400: ['Bad Request'],
            401: ['Unauthorized'],
            403: ['Forbidden'],
            404: ['Not Found'],
            405: ['Method Not Allowed'],
            406: ['Not Acceptable'],
            408: ['Request Timeout'],
            409: ['Conflict'],
            410: ['Gone'],
            415: ['Unsupported Media Type'],
            422: ['Unprocessable Entity'],
            429: ['Too Many Requests'],
            500: ['Internal Server Error'],
            503: ['Service Unavailable']
        }
        // set values for tags based on the statuscode
        let log = await dbFetch.master('/tables/data_log/data', 'POST', {
            status_code: res.statusCode,
            host: req.get('User-Agent'),
            service: 'Data Log', // event name, -- how to make this dynamic?
            environment: req.database,
            tags: tags[res.statusCode],// how to make this have items based on the service or status code?
            source: req.url,
            data: JSON.stringify(data) || null // data needed from input
        });
        // if log fails, retry twice, then exit. 
        if (log.error) {
            await dbFetch.master('/tables/data_log/data', 'POST', {
                status_code: res.statusCode,
                host: req.get('User-Agent'),
                service: 'Data Log', // event name, -- how to make this dynamic?
                environment: req.database,
                tags: tags[res.statusCode],// how to make this have items based on the service or status code?
                source: req.url,
                data: JSON.stringify(data) || null // data needed from input
            });
        };
        return res.json({
            code: res.statusCode,
            message: message[res.statusCode],
            data: data
        })
    };
    next();
}




