const path = require('path');
const axios = require('axios');
const mdLinks = require('../index');

describe('mdLinks', () => {
  it('It should read a markdown file and search for links correctly', async () => {
    const mockFile = path.resolve(__dirname, '../__mocks__/mock.md');
    const links = await mdLinks(mockFile);
    expect(links.length).toBe(7);
    expect(links[0].file.includes('mock.md')).toBeTruthy();
    expect(links[0].href).toBe(
      'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
    );
    expect(links[0].text).toBe('Arreglos');
  });

  it('It should return an error if the file does not exist', async () => {
    try {
      await mdLinks('./file-test.md');
    } catch (error) {
      expect(error.message).toBe("The provided path doesn't exist");
    }
  });

  it('It should read multiple files in nested directories', async () => {
    const mockFile = path.resolve(__dirname, '../__mocks__');
    const links = await mdLinks(mockFile);
    expect(links.length).toBe(9);
    expect(links[0].file.includes('mock2.md')).toBeTruthy();
    expect(links[0].href).toBe(
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    );
    expect(links[0].text).toBe('Mock 1');

    expect(links[8].file.includes('mock.md')).toBeTruthy();
    expect(links[8].href).toBe(
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce',
    );
    expect(links[8].text).toBe('Array.prototype.reduce() - MDN');
  });

  it('It should validate the links and return a 200 code per each of one', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve({
            status: 200,
          });
        }),
    );

    const mockFile = path.resolve(__dirname, '../__mocks__');
    const links = await mdLinks(mockFile, { validate: true });
    expect(links.length).toBe(9);
    expect(links[0].file.includes('mock2.md')).toBeTruthy();
    expect(links[0].href).toBe(
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    );
    expect(links[0].text).toBe('Mock 1');
    expect(links[0].ok).toBeTruthy();
    expect(links[0].status).toBe(200);
  });

  it('It should validate the links and return a 404 code when the resource is not found', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            response: {
              status: 404,
            },
          });
        }),
    );

    const mockFile = path.resolve(__dirname, '../__mocks__');
    const links = await mdLinks(mockFile, { validate: true });
    expect(links.length).toBe(9);
    expect(links[0].file.includes('mock2.md')).toBeTruthy();
    expect(links[0].href).toBe(
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    );
    expect(links[0].text).toBe('Mock 1');
    expect(links[0].ok).toBeFalsy();
    expect(links[0].status).toBe(404);
  });

  it('It should validate the links and return a 503 code when there is no communication with the server', async () => {
    jest.spyOn(axios, 'get').mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            request: {},
          });
        }),
    );

    const mockFile = path.resolve(__dirname, '../__mocks__');
    const links = await mdLinks(mockFile, { validate: true });
    expect(links.length).toBe(9);
    expect(links[0].file.includes('mock2.md')).toBeTruthy();
    expect(links[0].href).toBe(
      'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    );
    expect(links[0].text).toBe('Mock 1');
    expect(links[0].ok).toBeFalsy();
    expect(links[0].status).toBe(503);
  });
});
