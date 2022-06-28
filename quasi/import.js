var gulp = require('gulp'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-csso'),
    through = require('through2'),
    jsonTransform = require('gulp-json-transform'),
    rename = require("gulp-rename"),
    logger = require('../middleware/logger/'),
    path = require('path'),
    importFoler = path.join(__dirname + '/../', 'import/'),
    outputFolder = path.join(__dirname + '/../', 'bin/'),
    vfs = require('vinyl-fs'),
    change = require('gulp-change'),
    jeditor = require("gulp-json-editor"),
    jsonTransform = require('gulp-json-transform');

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

gulp.task('assemble-html', function() {
    vfs.src(importFoler + 'views/**/*.html')
        .pipe(change(function(content){
            return JSON.stringify({code: content});
        }))
        // .pipe(jsonTransform(function(data, file) {
        //     console.log("data");
        //     return { code: data };
        // }))
        .pipe(jeditor(function(json) {
            json.name = "idontknow";
            json.interpreter = "html";
            json.extension = "html";
            json.scripts = {
                "headStart" : [ "<link rel='stylesheet' href='index.css'>" ],
                "headEnd" : [],
                "bodyStart" : [],
                "bodyEnd" : []
            };

            return json;
        }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = (path.dirname + '/' + path.basename).replace(/\./g, "#"),
              split = basePath.split('/'),
              newPath = split.slice(0, split.length - 1).join('.'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, ".."); 
          filename = filename.replace(/#/g, ".."); 
          
          path.basename = "views." + newPath + "." + filename;
          path.extname = ".json"
          path.dirname = "";
        }))
        .pipe(vfs.dest(outputFolder + 'code/html/', { overwrite: false }))
});

gulp.task('assemble-javascript', function() {
    vfs.src(importFoler + 'views/**/*.js')
        .pipe(change(function(content){
            return JSON.stringify({code: content});
        }))
        // .pipe(jsonTransform(function(data, file) {
        //     console.log("data");
        //     return { code: data };
        // }))
        .pipe(jeditor(function(json) {
            json.name = "idontknow";
            json.interpreter = "html";
            json.extension = "html";
            json.scripts = {
                "headStart" : [ "<link rel='stylesheet' href='index.css'>" ],
                "headEnd" : [],
                "bodyStart" : [],
                "bodyEnd" : []
            };

            return json;
        }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = (path.dirname + '/' + path.basename).replace(/\./g, "#"),
              split = basePath.split('/'),
              newPath = split.slice(0, split.length - 1).join('.'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, ".."); 
          filename = filename.replace(/#/g, ".."); 
          
          path.basename = "views." + newPath + "." + filename;
          path.extname = ".json"
          path.dirname = "";
        }))
        .pipe(vfs.dest(outputFolder + 'code/javascript/', { overwrite: false }))
});

gulp.task('assemble-vendor-javascript', function() {
    vfs.src(importFoler + 'vendor/**/*.js')
        .pipe(change(function(content){
            return JSON.stringify({code: content});
        }))
        .pipe(jeditor(function(json) {
            json.name = "idontknow";
            json.interpreter = "javascript";
            json.extension = "js";

            return json;
        }))
        // .pipe(jsonTransform(function(data, file) {
        //     console.log("data");
        //     return { code: data };
        // }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = (path.dirname + '/' + path.basename).replace(/\./g, "#"),
              split = basePath.split('/'),
              newPath = split.slice(0, split.length - 1).join('.'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, ".."); 
          filename = filename.replace(/#/g, ".."); 
          
          path.basename = "vendor." + newPath + "." + filename;
          path.extname = ".json"
          path.dirname = "";
        }))
        .pipe(vfs.dest(outputFolder + 'code/javascript/', { overwrite: false }))
});

gulp.task('assemble-vendor-css', function() {
    vfs.src(importFoler + 'vendor/**/*.css')
        .pipe(change(function(content){
            return JSON.stringify({code: content});
        }))
        .pipe(jeditor(function(json) {
            json.name = "idontknow";
            json.interpreter = "css";
            json.extension = "css";

            return json;
        }))
        // .pipe(jsonTransform(function(data, file) {
        //     console.log("data");
        //     return { code: data };
        // }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = (path.dirname + '/' + path.basename).replace(/\./g, "#"),
              split = basePath.split('/'),
              newPath = split.slice(0, split.length - 1).join('.'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, ".."); 
          filename = filename.replace(/#/g, ".."); 
          
          path.basename = "vendor." + newPath + "." + filename;
          path.extname = ".json"
          path.dirname = "";
        }))
        .pipe(vfs.dest(outputFolder + 'code/css/', { overwrite: false }))
});

gulp.task('assemble-css', function() {
    vfs.src(importFoler + 'views/**/*.css')
        .pipe(change(function(content){
            return JSON.stringify({code: content});
        }))
        // .pipe(jsonTransform(function(data, file) {
        //     console.log("data");
        //     return { code: data };
        // }))
        .pipe(jeditor(function(json) {
            json.name = "idontknow";
            json.interpreter = "css";
            json.extension = "css";

            return json;
        }))
        .pipe(rename(function (path) {
            // Temporarily converting '..' so that we can have a '.' in a directory or filename
          let basePath = (path.dirname + '/' + path.basename).replace(/\./g, "#"),
              split = basePath.split('/'),
              newPath = split.slice(0, split.length - 1).join('.'),
              filename = split[split.length - 1];

          newPath = newPath.replace(/#/g, ".."); 
          filename = filename.replace(/#/g, ".."); 
          
          path.basename = "views." + newPath + "." + filename;
          path.extname = ".json"
          path.dirname = "";
        }))
        .pipe(vfs.dest(outputFolder + 'code/css/', { overwrite: false }))
});

gulp.task('assemble-vendor', [ 'assemble-vendor-javascript', 'assemble-vendor-css' ]);

gulp.task('import-code', [ 'assemble-html', 'assemble-javascript', 'assemble-css', 'assemble-vendor' ]);

gulp.task('import-assets', function() {
    gulp.src(importFoler + '/assets/**/*')
        .pipe(gulp.dest(outputFolder + 'assets/', { overwrite: false }));    
});

gulp.task('default', [ 'import-code', 'import-assets' ]);