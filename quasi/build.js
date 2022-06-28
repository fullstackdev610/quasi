var gulp = require('gulp'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-csso'),
    through = require('through2'),
    jsonTransform = require('gulp-json-transform'),
    rename = require("gulp-rename"),
    logger = require('../middleware/logger/'),
    path = require('path'),
    inputFolder = path.join(__dirname + '/../', 'bin/'),
    outputFolder = path.join(__dirname + '/../', 'build/public/');

// Inserts a string into another string before the single occurance where
function insertBefore(what, where, insert) {
    var split = what.split(where);
    
    return split[0] + insert + where + split[1];
}

// Inserts a string into another string after the single occurance where
function insertAfter(what, where, insert, complication) {
    var location = (what.indexOf(where) + 1) + (what.substring(what.indexOf(where)).indexOf(complication) + 1),
        firstHalf = what.substring(0, location),
        secondHalf = what.substring(location + 1);

    return firstHalf + insert + secondHalf;
}

function addInjectionPlaceholdersForHtmlPage(html) {

    html = insertAfter(html, "<head", "<!-- inject:headStart --><!-- endinject -->", '>');
    html = insertBefore(html, "</head>", "<!-- inject:headEnd --><!-- endinject -->");
    html = insertAfter(html, "<body", "<!-- inject:bodyStart --><!-- endinject -->", '>');
    html = insertBefore(html, "</body>", "<!-- inject:bodyEnd --><!-- endinject -->");

    return html;  
}

// How to gulp from string taken from; http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
}

gulp.task('transpile-html', function() {
  gulp.src(inputFolder + 'code/html/*.json')
        .pipe(jsonTransform(function(data, file) {
          /// Consider changing the way that html is piped using this information and calling .pipe(change()) initially for the code
            let htmlFile = data.code, 
                directiveCode = " <script>window.page = {}; window.page.directive = " + JSON.stringify(data.directive) + ";</script>";

            htmlFile = insertBefore(htmlFile, "</body>", directiveCode);
            htmlFile = addInjectionPlaceholdersForHtmlPage(htmlFile);
            
            return htmlFile;
        }))
        .pipe(rename(function (path) {
          let split = path.basename.split('.'),
              newPath = split.slice(0, split.length - 1).join('/'), 
              filename = split[split.length - 1];

          path.dirname = newPath;
          path.basename = filename;
          path.extname = ".html"
        }))
        /// TODO: add .pipe(inject()) here
        //.pipe(inject())
        .pipe(gulp.dest(outputFolder))
});

gulp.task('transpile-javascript', function() {
  gulp.src(inputFolder + 'code/javascript/*.json')
        .pipe(jsonTransform(function(data, file) {            
            return data.code;
        }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = path.basename.replace(/\.\./g, "#"),
              split = basePath.split('.'),
              newPath = split.slice(0, split.length - 1).join('/'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, "."); 
          filename = filename.replace(/#/g, "."); 


          path.dirname = newPath;
          path.basename = filename;
          path.extname = ".js"
        }))
        .pipe(gulp.dest(outputFolder))
});

gulp.task('transpile-css', function() {
  gulp.src(inputFolder + 'code/css/*.json')
        .pipe(jsonTransform(function(data, file) {            
            return data.code;
        }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = path.basename.replace(/\.\./g, "#"),
              split = basePath.split('.'),
              newPath = split.slice(0, split.length - 1).join('/'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, "."); 
          filename = filename.replace(/#/g, "."); 

          path.dirname = newPath;
          path.basename = filename;
          path.extname = ".css"
        }))
        .pipe(gulp.dest(outputFolder))
});

/// TODO: THIS IS OUR APP PIPELINE, put this flow into the build process of QUASI
gulp.task('transpile-code', [ 'transpile-css', 'transpile-html', 'transpile-javascript' ]);

gulp.task('copy-assets', function() { 
    gulp.src(inputFolder + '/assets/**/*')
        .pipe(gulp.dest(outputFolder + 'assets/', { overwrite: false }));
    gulp.src(inputFolder + '/vendor/**/*')
        .pipe(gulp.dest(outputFolder + 'vendor/', { overwrite: false }));
    gulp.src(inputFolder + '/views/**/*')
        .pipe(gulp.dest(outputFolder + 'views/', { overwrite: false }));
});

// Copying assets first so that the vendor code can be overwritten as well as the other assets
gulp.task('default', [ 'copy-assets', 'transpile-code' ]);