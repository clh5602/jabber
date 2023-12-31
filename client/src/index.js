//A function for handling our fetch response. Read init and sendFetch first.
const handleResponse = async (response, parseResponse, params) => {

    response.text().then((resText) => {

        const statusHeader = document.querySelector('#status');
        const messageHeader = document.querySelector('#message');

        // clear the content
        statusHeader.innerHTML = ``;
        messageHeader.innerHTML = ``;

        //Update header based on status code
        switch (response.status) {
            case 200: //Success
                statusHeader.innerHTML = "Success!";
                break;
            case 201: //Created
                statusHeader.innerHTML = "Created";
                break;
            case 204: //Updated
                statusHeader.innerHTML = "Updated (No Content)";
                break;
            case 400: //Bad Request
                statusHeader.innerHTML = "Bad Request";
                break;
            case 404: //Not Found
                statusHeader.innerHTML = "Not Found";
                break;
            case 409: //Server Conflict
                statusHeader.innerHTML = "Room Conflict";
                break;
            case 503: //Service Unavailable
                statusHeader.innerHTML = "All rooms are full!";
                break;
            default: //Anything Else
                statusHeader.innerHTML = "Status Code not Implemented";
                break;
        }

        if (parseResponse && (response.status != 204)) {
            let obj = JSON.parse(resText);

            messageHeader.innerHTML = obj.message;

            if (response.status == 200 || response.status == 201 || response.status == 409) {
                if (obj.emptyID) {
                    // this happens after GETting an empty room.
                    // now, claim that room via POST
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        },
                        body: `prompt=${params.prompt.slice(0, 1000)}&code=${obj.emptyID}`
                    }

                    // also limiting prompts to 1000 chars here
                    const fetchPromise = fetch(`/claim-room`, options);
                    fetchPromise.then((response) => { handleResponse(response, true) });
                    return;
                }

                if (obj.oldPrompt) {
                    // there was a room clash, need to get another free room
                    
                    // configure options
                    const options = {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        },
                    }

                    const fetchPromise = fetch(obj.newRequest, options);
                    fetchPromise.then((response) => { handleResponse(response, options.method === "GET", { prompt: obj.oldPrompt }) });
                    return;
                }

                if (obj.newRequest) {
                    // room exists, now get html
                    window.location.assign(`${obj.newRequest}`);
                    return;
                }
            }
        }
    });
};

// function called when attempting to join a room
const joinFormSubmit = async (joinForm) => {
    const code = document.getElementById('codeField').value.toUpperCase().trim();

    const joinAction = joinForm.getAttribute('action');
    const joinMethod = joinForm.getAttribute('method').toUpperCase();

    const formData = `?code=${code}`;

    // configure options
    const options = {
        method: joinMethod,
        headers: {
            'Accept': 'text/html, application/json'
        },
    }

    const url = joinAction + formData;

    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => { handleResponse(response, true) });
}

// makes either a GET or HEAD request to the correct URL when the form is submitted
const createFormSubmit = async (createForm) => {

    const prompt = document.getElementById('promptField').value.trim();

    const createAction = createForm.getAttribute('action');
    const createMethod = createForm.getAttribute('method').toUpperCase();

    // configure options
    const options = {
        method: createMethod,
        headers: {
            'Accept': 'application/json'
        },
    }

    const fetchPromise = fetch(createAction, options);
    fetchPromise.then((response) => { handleResponse(response, options.method === "GET", { prompt }) });
}

const init = () => {
    const joinForm = document.getElementById('joinForm');
    const createForm = document.getElementById('createForm');

    const joinRoom = (e) => {
        e.preventDefault();
        joinFormSubmit(joinForm);
        return false;
    }

    const createRoom = (e) => {
        e.preventDefault();
        createFormSubmit(createForm);
        return false;
    }

    joinForm.addEventListener("submit", joinRoom);
    createForm.addEventListener("submit", createRoom);
};

init();