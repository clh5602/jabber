let ROOM_ID;
let PREV_NUM_ANSWERS = 0;
let contentHTML;

let roomLoaded = false;

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
                    const numAnswers = obj.answers.length;

                    // flag for scrolling to bottom
                    let scrollFlag = (!roomLoaded || contentHTML.scrollHeight - (window.scrollY + window.innerHeight) < 20);

                    for (let i = PREV_NUM_ANSWERS; i < numAnswers; i++) {
                        let answer = obj.answers[i];

                        let postDiv = document.createElement("div");
                        let triangleDiv = document.createElement("div");
                        let postContent = document.createElement("p");

                        postDiv.classList.add('response');
                        triangleDiv.classList.add('triangle');
                        
                        postContent.textContent = answer;
                        postDiv.appendChild(postContent);                        

                        contentHTML.appendChild(postDiv);
                        contentHTML.appendChild(triangleDiv);
                    }

                    PREV_NUM_ANSWERS = numAnswers;

                    if (scrollFlag) {
                        window.scroll({top: contentHTML.scrollHeight});
                        roomLoaded = true;
                    }
                    return;
                }
            }
        }
    });
};

// function called when attempting to join a room
const postFormSubmit = async (postForm) => {

    const postAction = postForm.getAttribute('action');
    const postMethod = postForm.getAttribute('method').toUpperCase();

    const answerField = document.getElementById('answerField');

    const answer = answerField.value.trim();
    answerField.value = "";

    const formData = `code=${ROOM_ID}&answer=${answer.slice(0, 1000)}`;

    // configure options
    const options = {
        method: postMethod,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData
    }

    const fetchPromise = fetch(postAction, options);
    fetchPromise.then((response) => { handleResponse(response, false) });
}

const getPrompts = () => {
    // request prompts every second
    // SHORT POLLING
    setTimeout(getPrompts, 100);

    // configure options
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }

    const url = `/answers?code=${ROOM_ID}`;

    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => { handleResponse(response, true) });
}

const init = () => {
    // get the room ID from the page's html
    ROOM_ID = document.getElementById('room-code').innerHTML;

    // get a ref to the content
    contentHTML = document.getElementById(`content`);

    const postForm = document.getElementById('postForm');

    const post = (e) => {
        e.preventDefault();
        postFormSubmit(postForm);
        return false;
    }

    postForm.addEventListener("submit", post);

    getPrompts();
};

init();