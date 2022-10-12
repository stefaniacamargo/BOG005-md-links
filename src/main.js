const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { marked } = require("marked");

console.log(chalk.blue("Hello world!"));

/**
 * 
 * @param {string} fullPath 
 * @param {Object} [options]
 * @param {boolean} [options.validate]
 * @param {boolean} [options.stats]
 * @returns 
 */
function readMdFile(fullPath, options) {
  return new Promise((resolve, reject) => {
    const links = [];
    const isMarkdown = path.extname(fullPath) === ".md";
    if (!isMarkdown) {
      resolve(links);
    }
    fs.readFile(fullPath, "utf8", (error, data) => {
      if (error) reject(error);
      marked(data, {
        walkTokens: (token) => {
          if (token.type === "link" && token.href.includes("http")) {
            links.push({
              href: token.href,
              text: token.text,
              file: fullPath,
            });
          }
        },
      });
      resolve(links);
    });
  });
}

/**
 * 
 * @param {string} filePath 
 * @param {Object} [options]
 * @param {boolean} [options.validate]
 * @param {boolean} [options.stats]
 * @returns 
 */
function mdLinks(filePath, options) {
  const resolvedPath = path.resolve(filePath);
  const pathExist = fs.existsSync(resolvedPath);
  const pendingFilesToRead = [];
  if (!pathExist) {
    throw new Error("The provided path doesn't exist");
  }
  const isDirectory = fs.lstatSync(resolvedPath).isDirectory();
  if (isDirectory) {
    const dir = fs.readdirSync(resolvedPath, { withFileTypes: true });
    dir.forEach((fileName) => {
      if (fileName.isFile()) {
        pendingFilesToRead.push(readMdFile(path.resolve(resolvedPath, fileName.name)));
      }
    });
  } else {
    pendingFilesToRead.push(readMdFile(path.resolve(resolvedPath)));
  }
  return pendingFilesToRead;
}

module.exports = mdLinks;
