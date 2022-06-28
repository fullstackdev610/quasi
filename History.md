0.0.1 / 2017-01-10
==================

  * Initial release

0.1.0 -refactor / 2017-02-10
==================

  * Refactor of codebase to fit the scaffolding of an express site
  * Includes all of the features that were developed in conjunction with moltensteelman.com
  * Changed the structure of the framework to hold everything specific to the site in the bin folder (except for the configuration)

0.1.1 -refactor / 2017-02-25
==================

  * More refactor of codebase to fit express scaffolding
  * Split the structure of the app between; the bin folder, which holds the static data, schemas, and content, and the build folder which contains the output of the build and an index to run the app.

0.2.0  / 2017-02-26
==================

  * Final refactor of codebase to fit express scaffolding
  * Everything that is user editable is now in the bin folder, the entire output of the app is in the build folder
  * implemented a gulp build process with transpilers and assemblers for html, css, and javascript (the html using purejs on build output)
