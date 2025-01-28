
function addClass(element, str) {
    let arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
        element.classList.add(arr[i]);
    }
}

function createCard(author, title, body) {
    let card = document.createElement('div');

    addClass(card, "card post");

    card.appendChild(createCardBody(author, title, body));

    let posts = document.getElementById('posts');
    posts.appendChild(card);
}

function createCardBody(author, title, body) {
    let cardBody = document.createElement('div');
    addClass(cardBody, "card-body");

    cardBody.appendChild(createHeader(author));

    cardBody.appendChild(createTitle(title));

    cardBody.appendChild(createBody(body));

    cardBody.appendChild(createVoteArea());

    return cardBody;
}

function createHeader(author) {
    let header = document.createElement('div');
    addClass(header, 'container post-body-top-div');

    let img_source = 'https://pgmobile.puregold.com.ph/images/4800092330131.jpg?v=84';
    header.appendChild(createDpDiv(img_source));

    header.appendChild(createLinkToProfile(author));

    return header;
}

function createDpDiv(img_source) {
    let dpDiv = document.createElement('div'); // Counterpart: <div> </div>
    dpDiv.classList.add('dp-div'); // <div class="dp-div"></div>

    let img = document.createElement('img');

    img.src = img_source;

    dpDiv.appendChild(img);

    return dpDiv;
}

function createLinkToProfile(username) {
    let a = document.createElement('a');
    a.href = "https://youtube.com"; // link to profile hardcoded for now
    a.classList.add('text-decoration-none');
    a.target = '_blank';

    let h3 = document.createElement('h3');
    h3.classList.add('post-username');
    h3.innerHTML = username;

    a.appendChild(h3);
    return a;
}

/*
<h2 class="post-title">
    <a href="https://youtube.com" class="text-decoration-none text-reset" target="_blank">
        Ano favorite na chichirya niyo?
    </a>
</h2>
*/

function createTitle(title) {
    let h2 = document.createElement('h2');
    addClass(h2, 'post-title');

    let a = document.createElement('a');
    a.href = "https://youtube.com";
    addClass(a,"text-decoration-none text-reset");
    a.target = "_blank";

    a.innerHTML = title; 

    h2.appendChild(a);
    return h2;
}

/* 
<p class="card-text post-body-text">
    Nagugutom ako e
</p>
*/

function createBody(body) {
    let p = document.createElement('p');
    addClass(p, "card-text post-body-text");
    p.innerHTML = body;

    return p;
}

function createVoteArea(){

    let container = document.createElement('div');
    addClass(container, "col post-actions-div");

    let upvoteDiv = document.createElement('div');
    addClass(upvoteDiv, "score-count-div");

    let upvoteCount = document.createElement('p');
    addClass(upvoteCount, "score-count");
    upvoteCount.innerHTML = 420;

    let i = document.createElement('i');
    addClass(i, "bi bi-arrow-up-short post-icon h1");

    let i2 = document.createElement('i');
    addClass(i2, "bi bi-arrow-down-short post-icon h1");

    let downvoteDiv = document.createElement('div');
    addClass(downvoteDiv, "score-count-div");

    let downvoteCount = document.createElement('p');
    addClass(downvoteCount, "score-count");
    downvoteCount.innerHTML = 69;

    
/* 
<div class="col post-actions-div">
    <div class="score-count-div">
        <p class="score-count">420</p>
    </div>
    <i class="bi bi-arrow-up-short post-icon h1"></i>
    <div class="score-count-div">
        <p class="score-count">69</p>
    </div>
    <i class="bi bi-arrow-down-short post-icon h1"></i>
</div>
*/

    container.appendChild(upvoteDiv);
    container.appendChild(i);
    container.appendChild(downvoteDiv);
    container.appendChild(i2);

    upvoteDiv.appendChild(upvoteCount);

    downvoteDiv.appendChild(downvoteCount);

    return container;
}




