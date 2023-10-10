const Room = require('./Room.js'); // Room class

const rooms = {};
const NUM_ROOMS = 3;
const ID_LENGTH = 4;

const CHAR_NUM_OFFSET = 48; // unicode '0'
const CHAR_LETTER_OFFSET = 65; // unicode 'A'


// creates a random ID consisting of four digits,
// with values from 0-9 and A-Z
// NOTE: ID is not guaranteed to be unique
const generateID = () => {

  let resultingID = "";

  for (let i = 0; i < ID_LENGTH; i++) {
    const randomInt = Math.floor(Math.random() * 36);
    let newChar = '';

    if (randomInt < 10) {
      newChar = String.fromCharCode(randomInt + CHAR_NUM_OFFSET);
    }
    else {
      randomInt -= 10;
      newChar = String.fromCharCode(randomInt + CHAR_LETTER_OFFSET);
    }

    resultingID += newChar;
  }

  // here's where we could filter out specific
  // keys, like swears and such

  return resultingID;
};

// fills the rooms obj with a bunch of unoccupied
// rooms. The amount of rooms is based on "NUM_ROOMS"
const populateRooms = (rooms) => {
  let i = 0;

  while (i < NUM_ROOMS) {
    let newID = generateID();

    if (!rooms[newID]) {
      i++;
      rooms[newID] = new Room.Room(newID);
    }
  }
};

// gets a room obj from the rooms object
const getRoom = (id) => {
  return rooms[id];
};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as JSON
const getUsers = (request, response) => {
  respondJSON(request, response, 200, users);
};

// return user object as JSON
const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // check to make sure we have both fields
  if (!body.name || !body.age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[body.name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // if response is created, then set our created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// function that gets called when a request is not recognized -
// just throws a 404 with an obj response
const notFound = (request, response) => {
  const responseObj = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  return respondJSON(request, response, 404, responseObj);
};

// function that gets called when a request does not have correct params -
// mainly when a room is not recognized
const badRoomID = (request, response) => {
  const responseObj = {
    id: 'badRoomID',
    message: 'The room you are looking for was not found. Try a different ID.',
  };

  return respondJSON(request, response, 400, responseObj);
};

// function that gets called when a request does not contain
// the room ID
const noRoomID = (request, response) => {
  const responseObj = {
    id: 'noRoomID',
    message: 'Please provide a room ID.',
  };

  return respondJSON(request, response, 400, responseObj);
};

// function that gets called when a request does not contain
// the room ID
const roomExists = (request, response, id) => {
  const responseObj = {
    id: 'Success',
    message: 'Joining room...',
    newRequest: `/join-room?code=${id}`
  };

  return respondJSON(request, response, 200, responseObj);
};

// 404 for a "HEAD" request
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

//populateRooms(rooms);
rooms['1111'] = new Room.Room('1111');
rooms['1111'].occupied = true;

// exports to set functions to public
module.exports = {
  notFound,
  notFoundMeta,
  badRoomID,
  noRoomID,
  getRoom,
  roomExists
};