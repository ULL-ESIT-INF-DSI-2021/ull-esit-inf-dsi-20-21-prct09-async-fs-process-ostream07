import * as fs from 'fs';
import {spawn} from 'child_process';
import { join } from "path"; 


const filename: string = process.argv[3];
const dirPath = join('.', 'exercise.csv');

fs.access(filename, fs.constants.R_OK, (err) => {
  console.log('\n> Checking Permission for reading the file');
  if (!filename) {
    throw Error('A file to watch must be specified');
  } 
  if (err) {
    console.log('Error!');
  }
  else
    console.log('File can be read');
});

fs.watch(filename, () => {
  const cat = spawn('cat', [filename])
  cat.stdout.pipe(process.stdout)
});
/*
fs.watch(filename, (err) => {
  if (err) {
    console.log('Error!');
  } else {
    const cut = spawn('cut', ['-d', ',', '-f', '3', filename]);
    cut.stdout.pipe(process.stdout);
  }
});
*/
