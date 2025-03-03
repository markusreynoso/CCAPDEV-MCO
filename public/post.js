// function editPost(){
//     let modalTextArea = document.getElementById("edit-post-text-area");
//     let modalTitleArea = document.getElementById("edit-post-title-area");
//     let postTitle = document.querySelector(".post-title").textContent.replace(/\s+/g, ' ').trim();
//     let postText = document.querySelector(".post-body-text").textContent.replace(/\s+/g, ' ').trim();
//     modalTitleArea.value = postTitle;
//     modalTextArea.value = postText;
// }

// function editReplyComment(icon){
//     let parent = icon.parentElement.parentElement;
//     console.log(parent)
//     let text = parent.querySelector(".post-body-text").textContent.replace(/\s+/g, ' ').trim();
//     let modalTextArea = document.getElementById("edit-reply-comment-text-area");
//     modalTextArea.textContent = text;
// }