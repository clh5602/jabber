let ROOM_ID;
let lastResponseTime;

//A function for handling our fetch response. Read init and sendFetch first.
const handleResponse = async (response, parseResponse, params) => {

    response.text().then((resText) => {

        //const statusHeader = document.querySelector('#status');
        //const messageHeader = document.querySelector('#message');

        // clear the content
        //statusHeader.innerHTML = ``;
        //messageHeader.innerHTML = ``;

        //Update header based on status code
        switch (response.status) {
            case 200: //Success
                //statusHeader.innerHTML = "Success!";
                break;
            case 201: //Created
                //statusHeader.innerHTML = "Created";
                break;
            case 204: //Updated
                //statusHeader.innerHTML = "Updated (No Content)";
                break;
            case 400: //Bad Request
                //statusHeader.innerHTML = "Bad Request";
                break;
            case 404: //Not Found
                //statusHeader.innerHTML = "Not Found";
                break;
            case 409: //Server Conflict
                //statusHeader.innerHTML = "Room Conflict";
                break;
            case 503: //Service Unavailable
                //statusHeader.innerHTML = "All rooms are full!";
                break;
            default: //Anything Else
                statusHeader.innerHTML = "Status Code not Implemented";
                break;
        }

        if (parseResponse) {
            let obj = JSON.parse(resText);

            if (response.status == 200) {
                if (obj.answers) {
                    // happens after requesting a list of all answers
                    // populate the html
                    const content = document.getElementById(`content`);
                    const numAnswers = obj.answers.length;

                    for (let i = numAnswers - 1; i >= 0; i--) {
                        let answer = obj.answers[i];

                        if (lastResponseTime && lastResponseTime.getTime() >= answer.creation.getTime()) {
                            // now reaching responses that have already been parsed
                            break;
                        }

                        content.innerHTML = `<div class="response"><p>${answer.answer}</p></div>
                        <div class="triangle"></div>` + content.innerHTML;
                    }

                    if (numAnswers > 0) {
                        lastResponseTime = obj.answers[numAnswers - 1];
                    }

                    return;
                }
            }
        }
    });
};

// function called when attempting to join a room
const postFormSubmit = async (postForm) => {

    const postForm = joinForm.getAttribute('action');
    const postForm = joinForm.getAttribute('method').toUpperCase();

    const answer = document.getElementById('answerField').value.trim();

    const formData = `?code=${ROOM_ID}&answer=${answer}`;

    // configure options
    const options = {
        method: joinMethod,
        headers: {
            'Accept': 'application/json'
        },
    }

    const url = joinAction + formData;

    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => { handleResponse(response, true) });
}

const getPrompts = () => {
    // request prompts every second
    // SHORT POLLING
    setTimeout(getPrompts, 1000);

    // configure options
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }

    const url = `/responses?code=${ROOM_ID}`;

    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => { handleResponse(response, true) });
}

const init = () => {
    // get the room ID from the page's html
    ROOM_ID = document.getElementById('room-code').innerHTML;

    const postForm = document.getElementById('postForm');

    const post = (e) => {
        e.preventDefault();
        postFormSubmit(postForm);
        return false;
    }

    postForm.addEventListener("submit", post);

    setTimeout
};

init();