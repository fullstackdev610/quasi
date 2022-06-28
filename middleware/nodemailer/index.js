/* eslint no-console: 0 */

'use strict';
var nodemailer = require('nodemailer'),
    logger = require('../logger');

// Example taken from: http://masashi-k.blogspot.com/2013/06/sending-mail-with-gmail-using-xoauth2.html
// Uses nodemailer v0.7.1
// To get your client secret and ID: https://console.developers.google.com
// To get your refresh token go here: https://developers.google.com/oauthplayground
function sendMail(mailOptions, authentication) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: auth.service,
        auth: {
            XOAuth2: {
            user: authentication.user,
            clientId: authentication.clientId,
            clientSecret: authentication.clientSecret,
            refreshToken: authentication.refreshToken
            }
        }
    });

    // var mailOptions = {
    // replyTo: "any@whatever.com",
    // to: "user from auth (really doesn't matter because it is what is set for the auth)",
    // subject: "Hello",
    // generateTextFromHTML: true,
    // html: "<b>Hello world</b>"
    // };

    smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
        logger.logError(error);
        console.log(error);
    } else {
        logger.logSuccess(response);
        console.log(response);
    }
    smtpTransport.close();
    });
}

module.exports = { sendMail: sendMail };