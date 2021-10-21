/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const destPath = path.resolve(__dirname, '../src/schemas');
const basePath = path.resolve(__dirname, '../src/typings/db');
const files = fs.readdirSync(basePath).filter((filename) => path.extname(filename) === '.ts');
console.log(`All ts files: ${JSON.stringify(files)}`);

files.forEach((filename) => {
  console.log(`Generating schema for ${filename}`);
  const typeString = filename.split('.')[0];
  const dest = path.resolve(destPath, `${typeString}.schema.json`);
  const src = path.resolve(basePath, filename);
  child_process.exec(
    `npx typescript-json-schema ${src} ${typeString} -o ${dest} --required`,
    (err, _stdout, _stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Finished');
      // console.log('stdout: ' + stdout);
      // console.log('stderr: ' + stderr);
    }
  );
});
