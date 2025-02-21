function createCommentCardBody(author, body) {
    let cardBody = document.createElement('div');
    addClass(cardBody, "card-body");

    cardBody.appendChild(createHeader(author));

    cardBody.appendChild(createBody(body));

    cardBody.appendChild(createVoteArea());

    return cardBody;
}

function createCommentCard(author, body) {
    author = 'LuisDaBeast'; //Hardcoded for now; delete later on
    let card = document.createElement('div');

    addClass(card, "card post");

    card.appendChild(createCommentCardBody(author, body));

    let posts = document.getElementById('comments');
    posts.insertBefore(card, posts.firstChild);
}

function hardcodedCreateCommentCard() {
    let author = 'LuisDaBeast'; //Hardcoded for now; delete later on
    let body = document.getElementById('write-text-area').value;
    let card = document.createElement('div');

    addClass(card, "card post");

    card.appendChild(createCommentCardBody(author, "", body));

    let comments = document.getElementById('comments');
    console.log(comments.firstChild);
    posts.insertBefore(card, comments.firstChild);
    

    clearTextAreas(['write-title-area', 'write-text-area']);
}

 