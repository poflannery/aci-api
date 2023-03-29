const { rateLimit } = require("express-rate-limit");


module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    message: {
        message: 'You have exceeded the request limit. Please limit your requests going forward and try again in 15 minutes.',
        error: "Rate Limit Reached"
    },
    handler: function (req,res,next,options) {
        res.http(429).log(options.message)
    }
})