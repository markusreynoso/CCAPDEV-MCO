$(document).ready(function() {
    $(".bi-reply").click(function(){
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        
        $("#edit-reply-comment-text-area").val(`@${replyingTo} `)
    });
})