import { access, constants, watch } from "fs";
import * as yargs from "yargs";
import { join } from "path";


yargs.command({
  command: 'watch',
  describe: 'Looks for any change in a file',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string' && typeof argv.user === 'string') {
      const directoryName: string = argv.route;
      access(argv.route, constants.F_OK, (err) => {
        if (err) {
          console.log(`Directory ${directoryName} does not exist!`);
        } else {
          const watcher = watch(directoryName);

          watcher.on('change', (eventType, fileName) => {
            switch (eventType) {
              case 'rename':
                access(join(directoryName, fileName.toString()), constants.F_OK, (err) => {
                  if(err) {
                    console.log(`File ${fileName} was deleted`);
                  } else {
                    console.log(`File ${fileName} was created`);
                  }
                });
              case 'change':
                console.log(`File ${fileName} was modified`);
            }
          });
        }
      });
    }
  },
});

yargs.parse();

