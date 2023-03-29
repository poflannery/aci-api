const dbFetch = require('./index')

const getWhitelist = async function () {
    let whitelist;
    const data = await dbFetch.master('/tables/whitelists/query', 'POST', {
        columns: ['*'],
        filter: {
            environment: 'Development'
        }
    });

    return whitelist
}



const corsOptions = {
    origin: getWhitelist(),
    methods: ['GET','PUT','POST','DELETE','PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key','Access-Control-Allow-Origin'],
    maxAge: 3600,
    optionsSuccessStatus: 204

}

module.exports = corsOptions