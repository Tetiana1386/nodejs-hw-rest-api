const rateLimit = require('express-rate-limit');
const { HttpCode } = require('../helpers/constants');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    handler: (req, res, next) => {
        return res.status(HttpCode.TOO_MANY_REQUESTS).json({
            status: 'Error',
            code: HttpCode.TOO_MANY_REQUESTS,
            message: 'Too Many Requests',
        });
    },
})

module.exports = limiter;