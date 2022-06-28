var quasi = require('./quasi'),
    configuration = require("./bin/configuration");

quasi.configure(configuration);
quasi.run(8080);