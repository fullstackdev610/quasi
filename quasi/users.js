var router = require('express').Router(),
    /// For collection utilities
    _ = require('lodash'),
    /// For logging messages
    logger = ('../middleware/logger');

function autheticate(token, info, refreshToken, done) {
    _.find(configuration.users, function(user) {
        if(user.id == info.email) {
            logger.logInfo("User " + info.email + " authenticted using google");
            done(null, { email: info.email });
        }
    });
}

module.exports = {
    authenticate: autheticate
}