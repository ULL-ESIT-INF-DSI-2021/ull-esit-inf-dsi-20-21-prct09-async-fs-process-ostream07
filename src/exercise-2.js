"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var yargs = require("yargs");
yargs.command({
    command: 'pipe',
    describe: 'Looks for any change in a file',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        },
        lines: {
            describe: 'Number of lines',
            demandOption: false,
            type: 'boolean'
        },
        words: {
            describe: 'Number of words',
            demandOption: false,
            type: 'boolean'
        },
        characters: {
            describe: 'Number of characters',
            demandOption: false,
            type: 'boolean'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            var args = [];
            if (argv.lines) {
                args.push('-l');
            }
            if (argv.words) {
                args.push('-w');
            }
            if (argv.characters) {
                args.push('-c');
            }
            var subprocess = child_process_1.spawn('wc', __spreadArray(__spreadArray([], args), [argv.route]));
            subprocess.on('error', function () {
                console.log('Error with the command');
                process.exit(-1);
            });
            subprocess.stdout.pipe(process.stdout);
            subprocess.stderr.pipe(process.stderr);
            subprocess.on('close', function (code) {
                if (code) {
                    console.log('Command exited with code ' + code);
                }
                process.exit(code);
            });
        }
    }
});
yargs.command({
    command: 'event',
    describe: 'Looks for any change in a file',
    builder: {
        route: {
            describe: 'Directory route',
            demandOption: true,
            type: 'string'
        },
        lines: {
            describe: 'Number of lines',
            demandOption: false,
            type: 'boolean'
        },
        words: {
            describe: 'Number of words',
            demandOption: false,
            type: 'boolean'
        },
        characters: {
            describe: 'Number of characters',
            demandOption: false,
            type: 'boolean'
        }
    },
    handler: function (argv) {
        if (typeof argv.route === 'string') {
            var args = [];
            if (argv.lines) {
                args.push('-l');
            }
            if (argv.words) {
                args.push('-w');
            }
            if (argv.characters) {
                args.push('-c');
            }
            var subprocess = child_process_1.spawn('wc', __spreadArray(__spreadArray([], args), [argv.route]));
            subprocess.on('error', function () {
                console.log('Error with the command');
                process.exit(-1);
            });
            var output_1 = '';
            subprocess.stdout.on('data', function (chunk) { return (output_1 += chunk); });
            var outputError_1 = '';
            subprocess.stderr.on('data', function (chunk) { return (outputError_1 += chunk); });
            subprocess.on('close', function (code) {
                if (code) {
                    console.log("Command exited with code " + code);
                    if (outputError_1) {
                        console.log(outputError_1);
                    }
                    process.exit(code);
                }
                console.log(output_1);
            });
        }
    }
});
yargs.parse();
