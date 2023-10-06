/**
 * This file contains code pertaining to client-side requests,
 * such as HTML requests, CSS requests, and client JS requests.
 */

const fs = require('fs'); // pull in the file system module

// load in all files
const indexHTML = fs.readFileSync(`${__dirname}/../client/index.html`);
const roomHTML = fs.readFileSync(`${__dirname}/../client/room.html`);
const globalCSS = fs.readFileSync(`${__dirname}/../client/style.css`);

const mainJS = fs.readFileSync(`${__dirname}/../client/src/main.js`);
const floaterJS = fs.readFileSync(`${__dirname}/../client/src/floater.js`);
const canvasUtilsJS = fs.readFileSync(`${__dirname}/../client/src/canvas-utils.js`);

// function to handle general pages - takes the page file as the final param
const getHTMLPage = (request, response, page) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  response.end();
};

// function to get css page
const getCSS = (request, response, css) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to get js file
const getJS = (request, response, js) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(js);
  response.end();
};

// function for getting various files
const getIndexHTML = (request, response) => getHTMLPage(request, response, indexHTML);
const getRoomHTML = (request, response) => getHTMLPage(request, response, roomHTML);
const getGlobalCSS = (request, response) => getCSS(request, response, globalCSS);
const getMainJS = (request, response) => getJS(request, response, mainJS);
const getFloaterJS = (request, response) => getJS(request, response, mainJS);
const getCanvasUtilsJS = (request, response) => getJS(request, response, mainJS);



// exports to set functions to public
module.exports = {
  getIndexHTML,
  getRoomHTML,
  getGlobalCSS,
};
