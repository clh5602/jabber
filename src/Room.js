// how long a room should remain inactive for before closing (minutes)
const roomTimeout = 120;

class Room {
    constructor(id) {
        this.id = id;
        this.timeLastEdited = new Date();
        this.prompt = "NO_PROMPT";
        this.answers = [];
        this.occupied = false;
        this.updated = false;
    }

    checkTimeout() {
        if (!this.occupied) return false;

        const currentTime = new Date();

        if (Math.abs(this.timeLastEdited - currentTime) / 60000 > roomTimeout) {
            // room has been inactive for too long, shut it down
            this.prompt = "NO_PROMPT";
            this.occupied = false;
            this.updated = false;
            this.answers = [];
            return true;
        }

        return false;
    }

    addAnswer(answer) {
        this.answers.push(answer);
        this.updated = true;
        this.timeLastEdited = new Date();
    }

    updatePrompt(prompt) {
        this.prompt = prompt;
        this.updated = true;
        this.timeLastEdited = new Date();
    }

    claimRoom(prompt) {
        this.occupied = true;
        this.updatePrompt(prompt);
    }
}

// exports to set functions to public
module.exports = {
    Room
};
