const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const dir = fs.readdirSync(path.resolve(__dirname));

dir.forEach(fileName => {
  fs.readFile(path.resolve(__dirname, fileName), 'utf8', (error, data) => {
    if (error) throw error;
    console.log(data);
    console.log('------------------------');
  });
});

console.log(chalk.blue('Hello world!'));

