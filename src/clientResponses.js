/**
 * This file contains code pertaining to client-side requests,
 * such as HTML requests, CSS requests, and client JS requests.
 */

const fs = require('fs'); // pull in the file system module

// load in all files
const indexHTML = fs.readFileSync(`${__dirname}/../client/index.html`);
const roomHTML = fs.readFileSync(`${__dirname}/../client/room.html`);
const globalCSS = fs.readFileSync(`${__dirname}/../client/style.css`);
const favicon = fs.readFileSync(`${__dirname}/../client/favicon.ico`);

const mainJS = fs.readFileSync(`${__dirname}/../client/src/main.js`);
const floaterJS = fs.readFileSync(`${__dirname}/../client/src/floater.js`);
const indexJS = fs.readFileSync(`${__dirname}/../client/src/index.js`);
const roomJS = fs.readFileSync(`${__dirname}/../client/src/room.js`);

// function to handle general pages - takes the page file as the final param
const getHTMLPage = (request, response, page) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  response.end();
};

// sends the room html to the client after editing it with room code and prompt
const getRoomHTML = (request, response, roomCode, prompt, isHost) => {
  
  // build new HTML
  let newHTMLString = roomHTML.toString();
  newHTMLString = newHTMLString.replace('EX_ROOM_CODE', roomCode); // populate with room code
  newHTMLString = newHTMLString.replace('EX_PROMPT', prompt); // populate with prompt

  if (isHost) {
    /**
     * This is planned functionality for the room host
     * to be able to change the prompt at any time.
     * I would alter the room HTML here to allow this to
     * happen.
     */
  }

  return getHTMLPage(request, response, newHTMLString);
}

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

// function to get js file
const getFavicon = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/x-icon' });
  response.write(favicon);
  response.end();
};

// functions for getting various files
const getIndexHTML = (request, response) => getHTMLPage(request, response, indexHTML);
const getGlobalCSS = (request, response) => getCSS(request, response, globalCSS);
const getMainJS = (request, response) => getJS(request, response, mainJS);
const getFloaterJS = (request, response) => getJS(request, response, floaterJS);
const getIndexJS = (request, response) => getJS(request, response, indexJS);
const getRoomJS = (request, response) => getJS(request, response, roomJS);

// exports to set functions to public
module.exports = {
  getIndexHTML,
  getRoomHTML,
  getGlobalCSS,
  getMainJS,
  getFloaterJS,
  getIndexJS,
  getRoomJS,
  getFavicon
};
