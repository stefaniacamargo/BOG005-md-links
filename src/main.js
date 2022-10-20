const path = require("path");
const fs = require("fs");
const { marked } = require("marked");
const axios = require('axios');

/**
 * Makes a GET request to each link so we can validate them all
 * @param {Array<{ href: string, text: string, file: string }>} links
 * @returns
 */
function validateLinks(links) {
  return new Promise((resolve) => {
    const promiseArray = [];
    links.forEach(link => {
      promiseArray.push(new Promise((resolveGet) => {
        axios.get(link.href).then(response => {
          link.ok = true;
          link.status = response.status;
          resolveGet();
        }).catch(error => {
          let status = 500;
          if (error.response) {
            status = error.response.status;
          } else if (error.request) {
            status = 503;
          }
          link.ok = false;
          link.status = status;
          resolveGet();
        })
      }));
    });
    Promise.all(promiseArray).then(() => {
      resolve();
    });
  });
}

/**
 * Read the contents of each markdown file and get all the links inside of it
 * @param {string} fullPath 
 * @returns {Promise<Array<{ href: string, text: string, file: string }>>}
 */
function readMdFile(fullPath) {
  return new Promise((resolve, reject) => {
    const links = [];
    const isMarkdown = path.extname(fullPath) === ".md";
    if (!isMarkdown) {
      resolve(links);
      return;
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
 * Find links inside dirs or files
 * @param {string} filePath
 * @returns 
 */
function findLinks(filePath) {
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
      } else if (fileName.isDirectory()) {
        pendingFilesToRead.push(...findLinks(path.resolve(resolvedPath, fileName.name)));
      }
    });
  } else {
    pendingFilesToRead.push(readMdFile(path.resolve(resolvedPath)));
  }
  return pendingFilesToRead;
}

/**
 * 
 * @param {string} filePath 
 * @param {Object} [options]
 * @param {boolean} [options.validate]
 * @returns 
 */
function mdLinks(filePath, options = {}) {
  return new Promise((resolve) => {
    Promise.all(findLinks(filePath, options)).then((fileLinks) => {
      const mergedLinks = [];
      fileLinks.forEach(links => links.forEach(link => {
        mergedLinks.push(link);
      }));
      if (options.validate) {
        validateLinks(mergedLinks).then(() => {
          resolve(mergedLinks);
        });
        return;
      }
      resolve(mergedLinks);
    })
  });
}

function fib(n) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  let n2 = 0;
  let n1 = 1;
  let current = 0;
  for(let i = 2; i <= n; i++){
    current = n2 + n1;
    n2 = n1;
    n1 = current;
  }
  return current;
}

function fibRecursion(n) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fibRecursion(n - 1) + fibRecursion(n - 2);
}

// console.log(mdLinks('C:/Users/juanf/Documents/md-links-test', { validate: true }))

module.exports = mdLinks;
