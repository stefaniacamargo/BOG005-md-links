#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const mdLinks = require('./index');

console.log(
  chalk.magenta(figlet.textSync('mdLinks', { horizontalLayout: 'full' })),
);

const { argv } = yargs(hideBin(process.argv))
  .check((params) => {
    const filePaths = params._;
    if (filePaths.length !== 1) {
      throw new Error('Only 1 file or directory may be passed.');
    } else {
      return true; // tell Yargs that the arguments passed the check
    }
  })
  .options({
    validate: {
      describe: 'Search for broken links',
      type: 'boolean',
    },
    stats: {
      describe: 'Display some handy statistics about the links',
      type: 'boolean',
    },
  })
  .help();

const spinner = ora('Processing files...').start();
mdLinks(argv._[0], { validate: argv.validate }).then((links) => {
  spinner.stop();
  if (argv.stats) {
    const uniqueLinks = [...new Set(links.map((link) => link.href))];
    console.log(chalk.cyan('Total:', links.length));
    console.log(chalk.cyan('Unique:', uniqueLinks.length));
    if (argv.validate) {
      const brokenLinks = links.filter((link) => !link.ok);
      console.log(chalk.cyan('Broken:', brokenLinks.length));
    }
  } else {
    links.forEach((link) => {
      console.log(
        chalk.blue(link.file, link.href, link.text, link.ok, link.status),
      );
      console.log('');
    });
  }
});
