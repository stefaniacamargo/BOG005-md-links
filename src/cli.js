#!/usr/bin/env node

const mdLinks = require("./main");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const chalk = require("chalk");
const figlet = require("figlet");
const ora = require("ora");
console.log(
  chalk.yellow(figlet.textSync("mdLinks", { horizontalLayout: "full" }))
);

const { argv } = yargs(hideBin(process.argv))
  .check((argv) => {
    const filePaths = argv._;
    if (filePaths.length !== 1) {
      throw new Error("Only 1 file or directory may be passed.");
    } else {
      return true; // tell Yargs that the arguments passed the check
    }
  })
  .options({
    validate: {
      describe: "Search for broken links",
      type: "boolean",
    },
    stats: {
      describe: "Display some handy statistics about the links",
      type: "boolean",
    },
  })
  .help();

const spinner = ora("Processing files...").start();
mdLinks(argv._[0], { validate: argv.validate }).then((links) => {
  spinner.stop();
  if (argv.stats) {
    const uniqueLinks = [...new Set(links.map(link => link.href))];
    console.log(chalk.red('Total:', links.length));
    console.log(chalk.red('Unique:', uniqueLinks.length));
    if (argv.validate) {
      const brokenLinks = links.filter(links => !links.ok);
      console.log(chalk.red('Broken:', brokenLinks.length));
    }
  } else {
    links.forEach((link) => {
      console.log(
        chalk.blue(link.file, link.href, link.text, link.ok, link.status)
      );
      console.log("");
    });
  }
});
