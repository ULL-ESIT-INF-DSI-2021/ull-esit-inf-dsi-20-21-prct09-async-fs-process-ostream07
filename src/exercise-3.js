"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var yargs = require("yargs");
var path_1 = require("path");
yargs.command({
    command: 'watch',
    describe: 'Looks for any change in a file',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        },
        user: {
            describe: 'User name',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string' && typeof argv.user === 'string') {
            var directoryName_1 = argv.route;
            fs_1.access(argv.route, fs_1.constants.F_OK, function (err) {
                if (err) {
                    console.log("Directory " + directoryName_1 + " does not exist!");
                }
                else {
                    var watcher = fs_1.watch(directoryName_1);
                    watcher.on('change', function (eventType, fileName) {
                        switch (eventType) {
                            case 'rename':
                                fs_1.access(path_1.join(directoryName_1, fileName.toString()), fs_1.constants.F_OK, function (err) {
                                    if (err) {
                                        console.log("File " + fileName + " was deleted");
                                    }
                                    else {
                                        console.log("File " + fileName + " was created");
                                    }
                                });
                            case 'change':
                                console.log("File " + fileName + " was modified");
                        }
                    });
                }
            });
        }
    }
});
yargs.parse();
