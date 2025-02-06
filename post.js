function editPost(){
    let modalTextArea = document.getElementById("edit-post-text-area");
    let postText = document.querySelector(".post-body-text").textContent.replace(/\s+/g, ' ').trim();
    modalTextArea.value = postText;
}

function editReplyComment(icon){
    let parent = icon.parentElement.parentElement;
    console.log(parent)
    let text = parent.querySelector(".post-body-text").textContent.replace(/\s+/g, ' ').trim();
    let modalTextArea = document.getElementById("edit-reply-comment-text-area");
    modalTextArea.textContent = text;
}