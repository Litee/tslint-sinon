import * as fs from "fs";
import * as path from "path";
import * as shell from "shelljs";

const testDirectories = fs
  .readdirSync(__dirname)
  .map((directory) => path.resolve(__dirname, directory))
  .filter((p) => fs.lstatSync(p).isDirectory());

testDirectories
  .map((directory) => shell.exec(`tslint --test ${directory}`))
  .forEach((result) => {
    if (result.code !== 0) {
      process.exit(result.code);
    }
  });
