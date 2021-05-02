import { stat, mkdir, readdir, readFile, rm, copyFile } from "fs";
import { basename, join } from "path";
import * as yargs from 'yargs';

/**
 * Function that allow to copy a file or a directory
 * @param origin Origin route
 * @param destiny Destiny route
 */
function recursiveCopy(origin: string, destiny: string) {
  stat(origin, (err, stats) => {
    if (err) {
      console.log('Error!');
    } else {
      if (stats.isDirectory()) {
        let fileName = basename(origin);
        let newFolder = join(destiny, fileName);
        mkdir(newFolder, (err) => {
          if (err) {
            console.log('Error while copying');
          } else {
            readdir(origin, (err, files) => {
              if (err) {
                console.log('Error listing the content');
              } else {
                for (const file of files) {
                  recursiveCopy(join(newFolder, file), join(origin, file));
                }
              }
            })
          }
        });
      } else {
        stat(destiny, (err, stats) => {
          if (err) {
            if (err.code === 'ENOENT') {
              copyFile(origin, destiny, (err) => {
                if (err) {
                  console.log('Error while copying 34');
                }
              })
            }
            console.log('Error');
          } else {
            if (stats.isDirectory()) {
              destiny = join(destiny, basename(origin));
            }
            copyFile(origin, destiny, (err) => {
              if (err) {
                console.log('Error while copying 45');
              }
            })
          }
        })
      }
    }
  })
}

yargs.command({
  command: 'stat',
  describe: 'Indicates if the given object route is a file or directory',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      stat(argv.route, (err, stats) => {
        if (err) {
          console.log('Error!');
        } else {
          if (stats.isDirectory()) {
            console.log('The given route is a directory');
          } else {
            console.log('The given route is a file');
          }
        }
      })
    }
  },
});

yargs.command({
  command: 'mkdir',
  describe: 'Create a new directory',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      mkdir(argv.route, (err) => {
        if (err) {
          console.log('Error! The directory can not be created');
        } else {
          console.log('Directory created');
        }
      })
    }
  },
});

yargs.command({
  command: 'ls',
  describe: 'List the content of a directory',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      readdir(argv.route, (err, files) => {
        if (err) {
          console.log('Error');
        } else {
          console.log('\nDirectory content: ');
          for (const file of files) {
            console.log('\t' + file);
          }
        }
      })
    }
  },
});

yargs.command({
  command: 'cat',
  describe: 'Show the content of a file',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      readFile(argv.route, (err, data) => {
        if (err) {
          console.log('File can not be read');
        } else {
          console.log(data.toString());
        }
      })
    }
  },
});

yargs.command({
  command: 'rm',
  describe: 'Deletes the content of a file or directory',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      rm(argv.route, { recursive: true }, (err) => {
        if (err) {
          console.log('Can not delete');
        } else {
          console.log('Deleted');
        }
      })
    }
  },
});

yargs.command({
  command: 'cp',
  describe: 'Copies a file or directory',
  builder: {
    destinyRoute: {
      describe: 'Destiny',
      demandOption: true,
      type: 'string',
    },
    originRoute: {
      describe: 'Origin',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.destinyRoute === 'string' && typeof argv.originRoute === 'string') {
      recursiveCopy(argv.originRoute, argv.destinyRoute);
    }
  },
});

yargs.parse();