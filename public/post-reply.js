$(document).ready(function() {
    $(".bi-reply").click(function(){
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        
        $("#reply-comment-text-area").val(`@${replyingTo} `)
    });

    $(document).on("click", ".reply-comment-button", function () {
        let commentId = $(this).data("comment-id"); 
        $("#create-comment-reply-save-changes").data("comment-id", commentId); 
    });

    $("#create-comment-reply-save-changes").click(function(event) {
        event.preventDefault();

        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let newReply = $("#reply-comment-text-area").val();
        
        $.ajax({
            url: "/comment-replies",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                newReply: newReply
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error replying to the post", error);
                alert("Failed to create reply.")
            }
        })
    });

    $(document).on("click", ".reply-reply-button", function () {
        let replyId = $(this).data("reply-id"); 
        $("#create-reply-reply-save-changes").data("reply-id", replyId); 
    });

    $("#create-reply-reply-save-changes").click(function(event) {
        event.preventDefault();
        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let newReply = $("#reply-comment-text-area").val();
    })
    
})
