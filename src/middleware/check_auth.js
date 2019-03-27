const expressJwt = require('express-jwt')
const responseClient = require('../util/util').responseClient;

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles]
    }
    return [
        expressJwt({ secret: 'ItIsASecret' }),
        (req, res, next) => {
            console.log('req.user', req.user,)
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return responseClient(res, 401, 1, 'Unauthorized')
            }
            next()
        }
    ]
}
