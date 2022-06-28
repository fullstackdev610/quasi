# Framework
QUASI framework - an express based framework intended to provide all of the features you would need to run a simple webserver from simple configuration files that inform the app how it should serve your html pages, using a DOM structure based templating engine that enables developers to create their templates without a tightly coupled content management system. 

## QUASI configuration
The QUASI framework uses three configuration files for it's simple setup:
* auth.json - defines the authentication methods to use when configuring 'protected' routes.
~~~~ 
{
    "name": "AUTHENTICATION NAME",
    "clientID": "AUTHENTICATION CLIENT ID",
    "clientSecret": "AUTHENTICATION CLIENT SECRET",
    "authRoute": "THE ROUTE TO USE FOR AUTHENTICATION",
    "callbackRoute": "THE ROUTE TO USE FOR AUTHENTICATION CALLBACK",
    "callbackURL": "THE FULLY QUALIFIED PATH TO BE USED WHEN CONFIGURING AUTHENTICATION",
    "session": "THE NAME TO USE FOR THE AUTHENTICATION SESSION",
    "scope": [] - THE SCOPES TO USE WHEN CONFIGURING AUTHENTICATION
} 
~~~~
* routes.json - defines the routes to use for the application.
~~~~ 
{
    "route": "THE PATH OF THE ROUTE TO RESPOND TO",
    "template": "THE NAME OF THE TEMPLATE WITHIN THE /template/ PATH",
    "page": "RELATIVE PATH TO template TO USE FOR THE PAGE (default: index.html)",
    "content": "PATH TO CONTENT .json OBJECT",
    "protected": bool - whether or not to require authentication for this route
    "static": bool - if it is not a dynamic route, and to simply serve the path as is
}
~~~~ 
* scripts.json - defines the scripts to include on each served page that the application will insert: headStart, headEnd, bodyStart, bodyEnd
~~~~ 
{
    "script": "SCRIPT TO INSERT, HTML, THAT CAN BE EITHER RAW JAVASCRIPT OR SOURCE TO FILE",
    "location": "WHERE TO PUT THE TAG"
}
~~~~ 
* users.json - defines the users of the application that will determine who is allowed to be authenticated.
~~~~ 
{
    "id": "EMAIL ADDRESS OF USER TO AUTHENTICATE",
    "role": "CURRENTLY UNUSED"
}
~~~~ 

# Start it up
1. install nodejs
2. run `npm install`
3. run `bin\build` to create the output of the app
4. run `bin\start` to run the app

# Development
The bin folder is your home for QUASI development.

A QUASI app has the following JSON model structure:
~~~~ 
    code
    configuration
    content
~~~~ 
These folders contain json files that are used in configruation, build, and at runtime of the app.

A QUASI app also has the following static asset structure:
~~~~ 
    assets
    vendor
    views
~~~~ 
These folders are copied to the build output before the code is transpiled.

Themes can be developed statically, in the /bin/views/ folder as the paths are identical between served and unserved content.

The flow for developing a theme is to add a few items of html|javascript|css only, including the templating, to get started.

The vendor folder is for global libraries that can be modified from their original source or node_module middleware (minified versions are expected to be original source)

## Using PUREjs templating with the files in the /templates folder
The idea is that you can develop a theme without any of the server tech running with a text editor and verify your work by opening your html files in the browser. To do so the following points are expectations of template development.
\* This assumes that there are no external resources required for your templates.
* Libraries that are more specific to smaller aspects of a template remain in that template's folder
* Static assets that are only used for a specific template may remain in that template's folder. Templates using static assets only specific to that template are expected to use a relative path specific to that template's folder structure.
* Assets that are specific to site content would go into the /assets folder to be used between different templates. These assets are expected to use a path that goes the required levels out of the /templates folder (../../assets)

# Importing existing webpages
There is an import folder in the root of the project that you can drop existing web content into, currently only html|javascript|css, that is used with PUREJS and a directive to be transpiled into a json object file and used for the build output. Running `bin/import` will pull in all files in the folders `import/assets` and `import/views` and place them appropriately into the `bin/` folders to be developed on within QUASI.

# Build
There is a build process for copying the static assets to the ouput folder and then creating each of the files from the code folder into the output folder. Files that exist in code will overwrite files from the static assets. Run `bin/build` on the project to create the folder `build/public` to be served by the app.

# Philosophy
Websites should be configurable, scalable, replicable, sharable, updatable, and testable. These things mean different, but separate, solutions for different people - but those differences between developers shouldn't hold hostage the stack and course of development in order to deliver new web applications. Data layer interactions, state management, api interactivity, and the setup and teardown of features shouldn't be handled by the features themselves; this is a given.

To think that server technology support and external service connections required should dictate the end user experience, both from a UI perspective and an interopability standpoint, is limiting. As long as you know what features you want, you should be enabled to mix and match them as well as turn them on or off without needing to change source code. With the advent of entire website management tools like wordpress and squarespace, we can do a lot more to support the interopability of website features and service integrations by isolating these features from one another or from reaching across an entire application.

The management of individual website core features and their settings have long been developer controlled through configurations and modifications to source code, to which users have very little insight to or control over unless a detailed and constantly changing admin tool is provided. Even when these admin tools are created, they often require constant maintenance and have far too great an effect on the longevity of an application. There must be a way to separate business rules and service integration settings from the process of adding or removing common website features.

Quasi is much like wordpress or squarespace in that it allows you to manage features and themes for your website and gives you an interface for changing the settings for these features in an admin tool. However, what Quasi does differently is that it does not provide an implicit way to edit content for a website or the individual data that these features may use. Quasi has no storage dependencies beyond the source code that is imported to the site for feaures, allowing website management users to connect external database resources to their core features through a settings interface that is less convoluted with menu after menu.


# Vendors that make this project possible
* purejs (w/jquery)
* express
* passport
* foundation
* nodemailer
* gulp

# Roadmap
## 1.0.0
### Features 
* common OAUTH2 integrations using javascript web tokens
* route generation and script loading
* everything's a json object (EJO) Editor
* webpack integration
* React core components
* remoteStorage integration
* Google Chrome extension
* express generator starter project (CLI?)
