const corsOptions = {
    origin: ['http://localhost:8080','http://localhost:3000', 'http://localhost:5500'],
    methods: ['GET','PUT','POST','DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key','Access-Control-Allow-Origin'],
    maxAge: 3600,
    optionsSuccessStatus: 204

}

module.exports = corsOptions