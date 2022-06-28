var express = require('express'),
    router = express.Router(),
    /// For collection utilities
    _ = require('lodash'),
    /// So we can read files from the filesystem
    fs = require('fs'),
    /// To get relative and ultimate paths
    path = require('path'),
    /// For serving a favicon
    favicon = require('serve-favicon'),
    /// For logging messages
    logger = require('../middleware/logger/'),
    /// For sending emails
    mailer = require('../middleware/nodemailer/'),
    outputFolder = "../build/public/",
    config = {},
    routeKeys = [];

/// Serves template files and files from the static routes
function servePageOrFile(req, res) {
    logger.logNotice("incoming request: " + req.url);
    var lastSlashLocation = (req.url.indexOf('?') == -1) ? req.url.length -1 : req.url.indexOf('?') - 1;

    if(req.url[lastSlashLocation] != '/') {
        var redirect = req.url.substring(0, lastSlashLocation + 1) + '/' + req.url.substring(lastSlashLocation + 1);
        logger.logUpdate('redirecting to ' + redirect);
        return res.redirect(redirect);
    }
    var url = req.path.substring(0, req.path.length - 1),
        routeIndex = routeKeys.indexOf(url);
    
    if(routeIndex !== -1) {
        servePage(config.routes[routeIndex], req, res);
    }
    else {
        serveFile(req.path, req, res);
    }
}

// Inserts a string into another string before the single occurance where
function insertBefore(what, where, insert) {
    var split = what.split(where);
    
    return split[0] + insert + where + split[1];
}

// Inserts a string into another string after the single occurance where
function insertAfter(what, where, insert, complication) {
    var location = what.indexOf(where) + what.substring(what.indexOf(where)).indexOf(complication) + 1,
        firstHalf = what.substring(0, location),
        secondHalf = what.substring(location + 1);

    return firstHalf + insert + secondHalf;
}

function modifyPage(html, window_page_content) {
    var headStartScripts = '', 
        headEndScripts = '', 
        bodyStartScripts = '', 
        bodyEndScripts = '';

    _.forEach(config.scripts, function(script){
        switch(script.location) {
            case "headStart":
                headStartScripts += script.script;
                break;
            case "headEnd":
                headEndScripts += script.script;
                break;
            case "bodyStart":
                bodyStartScripts += script.script;
                break;
            case "bodyEnd":
                bodyEndScripts += script.script;
                break;
        }
    });

    
    // Remove the sample content for the template if it exists (REMNANT)
    html = html.replace('<script src="./sample.js"></script>', '');

    // Insert the page content to be used for PUREjs
    html = insertBefore(html, '</body>', '<script>window.page.content=' + window_page_content + '; $(document).foundation();</script>');

    html = insertAfter(html, "<head", headStartScripts, '>');
    html = insertBefore(html, "</head>", headEndScripts);
    html = insertAfter(html, "<body", bodyStartScripts, '>');
    html = insertBefore(html, "</body>", bodyEndScripts);
            
    return html;
}

function servePage(route, req, res) {
    logger.logSuccess('route matched: ' + route.route);

    var page = route.document != "" ? route.document : "index",
        html = path.join(__dirname, outputFolder, 'views/', route.template, '/', page + '.' + route.interpreter), 
        /// TODO: use dependency injection for the grabbing of front-end content 
        contentPath = path.join(__dirname, '../bin/', route.content),
        content;

    /// TODO: add serverside PUREjs templating for the <head> of the document
    /// TODO: Cachebusting - append the version of the app to the resource tags (css,js) WEBPACK

    try {
        // Get the html template
        html = fs.readFileSync(html, "utf8");
    } catch(e) {
        logger.logError('Error reading html template: ' + e);
        res.status(404).send();
        return;
    }

    try {
        // Get the page data to use in templating
        logger.logNotice("content: " + contentPath);
        content = fs.readFileSync(contentPath, "utf8");
    } catch(e) {
        logger.logError('Error reading content for template at ' + contentPath + ': ' + e);
        content = "''";
    }

    // Modify the html to include the page content and scripts
    html = modifyPage(html, content);
    
    // Send the html to the browser
    res.write(html);
    res.end();
}

function serveFile(route, req, res) {        
    var file = (req.url.indexOf('?') != -1) ? req.url.substring(0, req.url.indexOf('?')) : req.url;
    res.sendFile(path.join(__dirname, outputFolder, route, file), {  }, function(err) {
        if(err) {
            logger.logError("static file not found: " + route + req.url);
            res.status(404).send('File not found');
            res.end();
        }
        else {
            logger.logSuccess("serving static file: " + route + req.url);
        }
    });
}

function backupFile(target) {
    var date = new Date(),
        datestamp = (date.getMonth() + 1) + "-" + 
  					(date.getDate()) + "-" +
                    (date.getFullYear()),
        extension = "bak",
        backup = target + "." + datestamp + "." + extension;
    
    try{
        fs.writeFileSync(backup, fs.readFileSync(outputFolder + target));
    }
    catch(exceptiom) {
        
    }
}

function saveFile(contents, target) {
    backupFile(target);
    
    fs.writeFile(target, contents, function(err) {
        if(err) {
            logger.logError(err);
        }

        logger.logSuccess("Successfully saved file to " + target);
    }); 
}

// route middleware to make sure a user is authenticated
function ensureAuthenticated(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    logger.logNotice("saving " + req.url + " to redirect to after authentication");
    req.session.redirectTo = req.url;
    res.redirect('/login');
}

function initialize(configuration)
{
    config = configuration;
    routeKeys = _.map(configuration.routes, 'route');

    // Use the first route as the landing for the site
    router.get("", function(req, res) {
        let redirect = routeKeys[0] + '/';
        logger.logUpdate('[' + req.url + '] root requested, redirecting to landing page at route: ' + redirect);
        res.redirect(redirect);
    });

    // Configure routes
    _.forEach(configuration.routes, function(route) {
        var type = "dynamic";

        // If the route is static
        if(route.static === true) {
            /// TODO: should static routes be protectable?
            // Honestly I cannot figure this out <-- DID I FIGURE IT OUT?
            // Use static middleware without defined route 
            router.use(express.static(path.join(__dirname, outputFolder, '..', route.route)));
            type = "static";
        }
        // If this is a special route of type favicon
        else if(route.favicon === true) {
            try {
                router.use(favicon(path.join(__dirname, outputFolder, route.content))); 
                type = "favicon";
            }
            catch(e) { 
                logger.logError("favicon configuration failed.");
                type = "FAILED: " + e; 
            }
        }
        // If the user must be authenticated for this route
        else if(route.protected === true) {
            // servePageOrFile at this route with authentication
            router.get(route.route, ensureAuthenticated, servePageOrFile); 
            // Include the template folder
            router.use(route.route, ensureAuthenticated, function(req, res) {
                serveFile('views/' + route.template, req, res);
            }); 
            type += "-protected";
        }
        else {
            // servePageOrFile at this route
            router.get(route.route, servePageOrFile); 
            // Include the template folder as static route
            router.use(route.route, function(req, res) {
                serveFile('views/' + route.template, req, res);
            }); 
        }
        logger.logInfo("Configured " + type + " route: " + route.route);
    });

    router.get('*', function(req, res) {
        let redirect = routeKeys[0] + '/';
        logger.logUpdate('[' + req.url + '] route fallthrough, redirecting to landing page at route: ' + redirect);
        res.redirect(redirect);
    });

    return router;
}

module.exports = {
    initialize: initialize
}