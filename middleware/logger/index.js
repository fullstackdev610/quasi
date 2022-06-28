'use strict';

var /// To output console messages
    chalk = require('chalk');

module.exports = {
    logStatus : logStatus,
    logError : logError,
    logSuccess : logSuccess,
    logUpdate : logUpdate,
    logNotice: logNotice,
    logInfo : logInfo
};

function getTimestamp() {
    let d = new Date();
    return d.toLocaleTimeString();  
}

function formatMessage(message, options) {
    if(options) {
        message = options.prepend ? options.prepend + message : message;
        message = options.domain ? "{ " + options.domain + " } " + message : message;
        message = options.showTimestamp ? "[" + getTimestamp() + "] " + message : message;
        message = options.append ? message + options.append : message;
    }

    return message;
}

function logStatus(message, options) {
    message = formatMessage(message, options);
    
    logChalkMessage(chalk.yellow, message);
}

function logError(message, options) {
    message = formatMessage(message, options);
    
    logChalkMessage(chalk.red, message);
}

function logSuccess(message, options) {
    message = formatMessage(message, options);
    
    logChalkMessage(chalk.green, message);
}

function logUpdate(message, options) {
    message = formatMessage(message, options);
    
    logChalkMessage(chalk.magenta, message);
}

function logNotice(message, options) {
    message = formatMessage(message, options);

    logChalkMessage(chalk.blue, message);
}

function logInfo(message, options) {
    message = formatMessage(message, options);
    
    log(message);
}


function logChalkMessage(styles, message) {
    
    console.log(styles(message));
}

function log(message, options) {
    message = formatMessage(message, options);

    console.log(message);    
}