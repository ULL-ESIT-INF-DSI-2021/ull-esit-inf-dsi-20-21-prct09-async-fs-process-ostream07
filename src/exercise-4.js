"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var yargs = require("yargs");
function recursiveCopy(origin, destiny) {
    fs_1.stat(origin, function (err, stats) {
        if (err) {
            console.log('Error!');
        }
        else {
            if (stats.isDirectory()) {
                var fileName = path_1.basename(origin);
                var newFolder_1 = path_1.join(destiny, fileName);
                fs_1.mkdir(newFolder_1, function (err) {
                    if (err) {
                        console.log('Error while copying');
                    }
                    else {
                        fs_1.readdir(origin, function (err, files) {
                            if (err) {
                                console.log('Error listing the content');
                            }
                            else {
                                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                                    var file = files_1[_i];
                                    recursiveCopy(path_1.join(newFolder_1, file), path_1.join(origin, file));
                                }
                            }
                        });
                    }
                });
            }
            else {
                fs_1.stat(destiny, function (err, stats) {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            fs_1.copyFile(origin, destiny, function (err) {
                                if (err) {
                                    console.log('Error while copying 34');
                                }
                            });
                        }
                        console.log('Error');
                    }
                    else {
                        if (stats.isDirectory()) {
                            destiny = path_1.join(destiny, path_1.basename(origin));
                        }
                        fs_1.copyFile(origin, destiny, function (err) {
                            if (err) {
                                console.log('Error while copying 45');
                            }
                        });
                    }
                });
            }
        }
    });
}
yargs.command({
    command: 'stat',
    describe: 'Indicates if the given object route is a file or directory',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            fs_1.stat(argv.route, function (err, stats) {
                if (err) {
                    console.log('Error!');
                }
                else {
                    if (stats.isDirectory()) {
                        console.log('The given route is a directory');
                    }
                    else {
                        console.log('The given route is a file');
                    }
                }
            });
        }
    }
});
yargs.command({
    command: 'mkdir',
    describe: 'Create a new directory',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            fs_1.mkdir(argv.route, function (err) {
                if (err) {
                    console.log('Error! The directory can not be created');
                }
                else {
                    console.log('Directory created');
                }
            });
        }
    }
});
yargs.command({
    command: 'ls',
    describe: 'List the content of a directory',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            fs_1.readdir(argv.route, function (err, files) {
                if (err) {
                    console.log('Error');
                }
                else {
                    console.log('Directory content: ');
                    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                        var file = files_2[_i];
                        console.log('\t' + file);
                    }
                }
            });
        }
    }
});
yargs.command({
    command: 'cat',
    describe: 'Show the content of a file',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            fs_1.readFile(argv.route, function (err, data) {
                if (err) {
                    console.log('File can not be read');
                }
                else {
                    console.log(data.toString());
                }
            });
        }
    }
});
yargs.command({
    command: 'rm',
    describe: 'Deletes the content of a file or directory',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            fs_1.rm(argv.route, { recursive: true }, function (err) {
                if (err) {
                    console.log('Can not delete');
                }
                else {
                    console.log('Deleted');
                }
            });
        }
    }
});
yargs.command({
    command: 'cp',
    describe: 'Copies a file or directory',
    builder: {
        destinyRoute: {
            describe: 'Destiny',
            demandOption: true,
            type: 'string'
        },
        originRoute: {
            describe: 'Origin',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        if (typeof argv.destinyRoute === 'string' && typeof argv.originRoute === 'string') {
            recursiveCopy(argv.originRoute, argv.destinyRoute);
        }
    }
});
yargs.parse();
