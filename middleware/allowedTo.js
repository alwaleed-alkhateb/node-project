const appError = require('../utils/appError');


module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.decoded.role)) {
            return next(appError.create('You do not have permission to perform this action', 403, 'Forbidden'));
        }
        next();
    }
}