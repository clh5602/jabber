// INFO ON LONG POLLING FROM https://javascript.info/long-polling

let ROOM_ID;
let PREV_NUM_ANSWERS = 0;
let contentHTML;

const USE_SHORT_POLLING = true;

let roomLoaded = false;

const subscribe = async () => {
    // configure options
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    }

    const url = `/subscribe?code=${ROOM_ID}`;

    const fetchPromise = fetch(url, options);
    fetchPromise.then((response) => { handleResponse(response, true) });
}

//A function for handling our fetch response
const handleResponse = async (response, parseResponse) => {

    response.text().then((resText) => {

        // timeout from subscribe, retry
        if (!USE_SHORT_POLLING && response.status === 502) {
            subscribe();
            return;
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
                        window.scroll({ top: contentHTML.scrollHeight });
                        roomLoaded = true;
                    }

                    if (!USE_SHORT_POLLING) subscribe();
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

const getAnswers = () => {
    
    if (USE_SHORT_POLLING) setTimeout(getAnswers, 200);
    
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

    // initialize page with answers
    getAnswers();

    if (!USE_SHORT_POLLING) subscribe();
};

init();