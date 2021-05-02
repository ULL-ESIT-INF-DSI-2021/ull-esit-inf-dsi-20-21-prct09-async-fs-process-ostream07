import { spawn } from "child_process";
import * as yargs from "yargs";


yargs.command({
  command: 'pipe',
  describe: 'Looks for any change in a file',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
    lines: {
      describe: 'Number of lines',
      demandOption: false,
      type: 'boolean',
    },
    words: {
      describe: 'Number of words',
      demandOption: false,
      type: 'boolean',
    },
    characters: {
      describe: 'Number of characters',
      demandOption: false,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      let args: string[] = [];
      if (argv.lines) {
        args.push('-l');
      }
      if (argv.words) {
        args.push('-w');
      }
      if (argv.characters) {
        args.push('-c');
      }
      let subprocess = spawn('wc', [...args, argv.route]);
      subprocess.on('error', () => {
        console.log('Error with the command');
        process.exit(-1);
      });

      subprocess.stdout.pipe(process.stdout);
      subprocess.stderr.pipe(process.stderr);

      subprocess.on('close', (code) => {
        if(code) {
          console.log('Command exited with code ' + code);
        }
        process.exit(code);
      });
    }
  },
});

yargs.command({
  command: 'event',
  describe: 'Looks for any change in a file',
  builder: {
    route: {
      describe: 'Directory route',
      demandOption: true,
      type: 'string',
    },
    lines: {
      describe: 'Number of lines',
      demandOption: false,
      type: 'boolean',
    },
    words: {
      describe: 'Number of words',
      demandOption: false,
      type: 'boolean',
    },
    characters: {
      describe: 'Number of characters',
      demandOption: false,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      let args: string[] = [];
      if (argv.lines) {
        args.push('-l');
      }
      if (argv.words) {
        args.push('-w');
      }
      if (argv.characters) {
        args.push('-c');
      }
      let subprocess = spawn('wc', [...args, argv.route]);
      subprocess.on('error', () => {
        console.log('Error with the command');
        process.exit(-1);
      });

      let output = '';
      subprocess.stdout.on('data', (chunk) => (output += chunk));

      let outputError = '';
      subprocess.stderr.on('data', (chunk) => (outputError += chunk));

      subprocess.on('close', (code) => {
        if (code) {
          console.log(`Command exited with code ${code}`);
          if (outputError) {
            console.log(outputError);
          }
          process.exit(code);
        }
        console.log(output);
      });
    }
  },
});

yargs.parse();