#!/usr/bin/env node

const mdLinks = require("./main");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const chalk = require("chalk");
const { argv } = yargs(hideBin(process.argv));

if (argv.validate) {
  console.log("Validate links");
} else {
  console.log("No validate links");
}

if (argv.stats) {
  console.log("Show stats");
} else {
  console.log("No show stats");
}

mdLinks(argv._[0], { validate: true }).then((links) => {
  links.forEach((link) => {
    console.log(chalk.blue(link.file, link.href, link.text, link.ok, link.status));
    console.log("");
  });
});
