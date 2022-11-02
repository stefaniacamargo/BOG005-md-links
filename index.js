const { findLinks, validateLinks } = require('./src/utils');

/**
 * Search for links inside Markdown files
 * @param {string} filePath
 * @param {Object} [options]
 * @param {boolean} [options.validate]
 * @returns {Promise<Array<{ href: string, text: string, file: string }>>}
 */
function mdLinks(filePath, options = {}) {
  return new Promise((resolve) => {
    Promise.all(findLinks(filePath, options)).then((filesLinks) => {
      const mergedLinks = [];
      filesLinks.forEach((fileLinks) =>
        fileLinks.forEach((link) => {
          mergedLinks.push(link);
        }),
      );
      if (options.validate) {
        validateLinks(mergedLinks).then(() => {
          resolve(mergedLinks);
        });
        return;
      }
      resolve(mergedLinks);
    });
  });
}

module.exports = mdLinks;
