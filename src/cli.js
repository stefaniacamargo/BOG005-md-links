#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
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