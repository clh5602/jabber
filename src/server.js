const http = require('http');
const url = require('url');
// pull in the query string module
const query = require('querystring');

// pull in the response handler files
const clientHandler = require('./clientResponses.js');
// pull in our json response handler file
const requestHandler = require('./dataResponses.js');

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
  GET: {
    // client stuff
    '/': clientHandler.getIndexHTML,
    '/style.css': clientHandler.getGlobalCSS,
    '/src/main.js': clientHandler.getMainJS,
    '/src/floater.js': clientHandler.getFloaterJS,
    '/src/index.js': clientHandler.getIndexJS,
    '/src/room.js': clientHandler.getRoomJS,
    '/favicon.ico': clientHandler.getFavicon,
    '/join-room': clientHandler.getRoomHTML,
    // JSON data
    '/locate-room': requestHandler.roomExists,
    '/find-room': requestHandler.findRoom,
    '/answers': requestHandler.getAnswers,
    '/subscribe': requestHandler.subscribe,
    notFound: requestHandler.notFound,
  },
  HEAD: {
    '/locate-room': requestHandler.roomExistsMeta,
    '/find-room': requestHandler.findRoomMeta,
    '/answers': requestHandler.getAnswersMeta,
    notFound: requestHandler.notFoundMeta,
  },
  POST: {
    '/claim-room': requestHandler.claimRoom,
    '/add-answer': requestHandler.addAnswer,
    notFound: requestHandler.notFound,
  },
  notFound: requestHandler.notFound,
};

const parseBody = (request, response, callback) => {
  const body = [];

  // if an error occurs, handle it
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // called when receiving a piece of the data.
  // it comes in order, so we just push the data onto the body array.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // when the data is complete
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    callback(request, response, bodyParams);
  });
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
  // parse the url using the url module
  const parsedUrl = url.parse(request.url);

  if (parsedUrl.pathname === '/subscribe') console.log(`new subscribe! ${Math.random()}`);
  // if query provided, convert the query to a js object.
  const params = query.parse(parsedUrl.query);

  // only support GET, HEAD, and POST
  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }

  // SPECIAL CASE : '/join-room'
  // returns HTML, or json if fail
  if (parsedUrl.pathname === '/join-room' || parsedUrl.pathname === '/locate-room') {
    const isHeadRequest = (request.method === 'HEAD');

    // first, get the room id from params
    const providedID = params.code;

    // verify ID was provided
    if (!providedID) {
      return isHeadRequest ? requestHandler.noRoomIDMeta(request, response)
        : requestHandler.noRoomID(request, response);
    }

    // get room associated with ID
    const providedRoom = requestHandler.getRoom(providedID);

    // verify room exists, and is occupied
    if (!providedRoom || !providedRoom.occupied) {
      return isHeadRequest ? requestHandler.badRoomIDMeta(request, response)
        : requestHandler.badRoomID(request, response);
    }

    // get the room's HTML
    const callback = urlStruct[request.method][parsedUrl.pathname];
    return callback(request, response, providedRoom.id, providedRoom.prompt);
  }

  // if function exists, call it!
  if (urlStruct[request.method][parsedUrl.pathname]) {
    // post is special
    if (request.method === 'POST') {
      return parseBody(request, response, urlStruct[request.method][parsedUrl.pathname]);
    }
    return urlStruct[request.method][parsedUrl.pathname](request, response, params);
  }

  return urlStruct[request.method].notFound(request, response);
};

// start HTTP server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
