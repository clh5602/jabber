// INFO ON LONG POLLING FROM https://javascript.info/long-polling

// how long a room should remain inactive for before closing (minutes)
const ROOM_TIMEOUT = 120;

class Room {
  constructor(id) {
    this.id = id;
    this.timeLastEdited = new Date();
    this.prompt = 'NO_PROMPT';
    this.answers = [];
    this.occupied = false;
    this.subscribers = {};
  }

  // [long polling] when someone requests info, add them to the update list
  addSubscriber(request, response) {
    let subscriberID;

    // generates unique ID
    do {
      subscriberID = Math.random();
    } while (this.subscribers[subscriberID]);

    response.setHeader('Cache-Control', 'no-cache, must-revalidate');

    this.subscribers[subscriberID] = response;

    // timeout
    request.on('close', () => { delete this.subscribers[subscriberID]; });
  }

  // [long polling] sends the new info to every subscriber
  notifySubscribers() {
    const subscriberIDs = Object.keys(this.subscribers);
    const numSubscribers = subscriberIDs.length;

    const responseObj = {
      answers: this.answers,
    };

    for (let i = 0; i < numSubscribers; i++) {
      const thisRes = this.subscribers[subscriberIDs[i]];
      thisRes.writeHead(200, { 'Content-Type': 'application/json' });
      thisRes.write(JSON.stringify(responseObj));
      thisRes.end();
    }

    this.subscribers = {};
  }

  // if this room has been inactive for too long, free it
  checkTimeout(currentTime) {
    if (!this.occupied) return false;

    if (Math.abs(this.timeLastEdited.getTime() - currentTime) / 60000 > ROOM_TIMEOUT) {
      // room has been inactive for too long, shut it down
      this.prompt = 'NO_PROMPT';
      this.occupied = false;
      this.answers = [];
      this.subscribers = {};
      return true;
    }

    return false;
  }

  // add a new answer, update subscribers
  addAnswer(answer) {
    this.answers.push(answer);
    this.notifySubscribers();
    this.timeLastEdited = new Date();
  }

  // functionality for changing a room's prompt while it's open
  // not supported in the final release
  updatePrompt(prompt) {
    this.prompt = prompt;
    this.notifySubscribers();
    this.timeLastEdited = new Date();
  }

  // sets this room to "occupied"
  claimRoom(prompt) {
    this.occupied = true;
    this.updatePrompt(prompt);
  }
}

// exports to set functions to public
module.exports = {
  Room,
};
