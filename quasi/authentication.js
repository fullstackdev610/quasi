var router = require('express').Router(),
    /// For collection utilities
    _ = require('lodash'),
    /// For logging messages
    logger = ('../middleware/logger'),
    /// For authenticating Google account users
    GoogleOauthJWTStrategy = require('passport-google-oauth-jwt').GoogleOauthJWTStrategy,
    /// For authenticating QUASI users
    users = require('./users');

function initialize(configuration, passport) {
    // Configure passport methods
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // Configure sessions for authentication 
    _.forEach(configuration.authentication, function(authentication) {
        logger.logInfo("Configuring authentication: " + authentication.name);
        
        router.use(session({
            secret: authentication.session,
            resave: false,
            saveUninitialized: false
        }));

        switch(authentication.name) {
            case "google": 
                passport.use(new GoogleOauthJWTStrategy({
                    clientId: authentication.clientID,
                    clientSecret: authentication.clientSecret
                }, function verify(token, info, refreshToken, done) {
                   users.authenticate(token, info, refreshToken, done);
                }));

                 if(authentication.service) {
                     // For sending mail
                    router.post('/' + authentication.service, function(req, res){
                        /// TODO: very that the request is coming from the app itself
                        logger.logNotice(req.body);

                        // Validate the incoming data
                        if(req.body.replyTo.length > 0 && req.body.logger.length > 0) {
                            logger.logNotice("Sending email");
                        
                            var mailOptions = {
                                replyTo: req.body.replyTo + " <" + req.body.name + ">",
                                to: authentication.user,
                                subject: req.body.subject,
                                generateTextFromHTML: true,
                                html: req.body.message
                            };
                            nodemailer.sendMail(mailOptions, authentication);
                        }
                        else {
                            logger.logError("Email data incomplete");
                        }
                    });
                }
                break;
        }
        
        /// TODO: Might have to put this in a separate loop or function outside of this one
        // request google login
        router.get( authentication.authRoute, passport.authenticate( authentication.session, 
            { callbackUrl: authentication.callbackURL, scope: authentication.scope }));

        // handle google callback
        router.get( authentication.callbackRoute, 
            passport.authenticate( authentication.session, 
            { callbackUrl: authentication.callbackURL}),
            function(req, res) {
                var redirectTo = req.session.redirectTo;
                delete req.session.redirectTo;
                res.redirect(redirectTo);
        });
    });

    return router;
}

module.exports = {
    sessions: [],
    routes: [],
    initialize: initialize
}