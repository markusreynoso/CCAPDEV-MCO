$(document).ready(function() {
    $(".bi-reply").click(function(){
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        
        $("#reply-comment-modal-title").text(`Reply to @${replyingTo}`)
    });

    $(document).on("click", ".reply-comment-button", function () {
        let commentId = $(this).data("comment-id"); 
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        $("#create-comment-reply-save-changes").data("replyingTo-username", replyingTo); 
        $("#create-comment-reply-save-changes").data("comment-id", commentId); 
    });

    $("#create-comment-reply-save-changes").click(function(event) {
        event.preventDefault();

        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let replyingTo = "@" + $(this).data("replyingTo-username")
        let newReply = $("#reply-comment-text-area").val();
        
        if (!newReply) {
            alert("Reply must be nonempty.");
            return;
        }
        $.ajax({
            url: "/comment-replies",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                replyingTo: replyingTo,
                newReply: newReply
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error replying to the reply", error);
                alert("Failed to reply.");
            }
        })
    });

    $(".bi-reply").click(function(){
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        
        $("#reply-reply-modal-title").text(`Reply to @${replyingTo}`)
    });

    $(document).on("click", ".reply-reply-button", function () {
        let commentId = $(this).data("comment-id");
        let replyId = $(this).data("reply-id"); 
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();

        $("#create-reply-reply-save-changes").data("replyingTo-username", replyingTo); 
        $("#create-reply-reply-save-changes").data("comment-id", commentId); 
        $("#create-reply-reply-save-changes").data("reply-id", replyId); 
    });

    $("#create-reply-reply-save-changes").click(function(event) {
        event.preventDefault();
        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let replyId = $(this).data("reply-id")
        let replyingTo = "@" + $(this).data("replyingTo-username");
        let newReply = $("#reply-reply-text-area").val();


        if (!newReply) {
            alert("Reply must be nonempty.");
            return;
        }

        $.ajax({
            url: "/reply-replies",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                replyId: replyId,
                replyingTo, replyingTo,
                newReply: newReply
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error replying to the reply", error);
                alert("Failed to reply.")
            }
        })
       
    })
    
})
