#!/usr/bin/env node

const mdLinks = require('./main');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require("chalk");
const { argv } = yargs(hideBin(process.argv));

if (argv.validate) {
  console.log('Validate links');
} else {
  console.log('No validate links');
}

if (argv.stats) {
  console.log('Show stats');
} else {
  console.log('No show stats')
}

Promise.all(mdLinks(argv._[0])).then((fileLinks) => {
  fileLinks.forEach(links => {
    console.log(links);
    console.log(chalk.red('-------------------------------'));
  })
})