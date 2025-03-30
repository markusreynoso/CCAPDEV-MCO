$(document).ready(function() {

    function showToastComment(message, type = "danger") {
        let toastElement = $("#reply-to-comment-toast");

        toastElement.removeClass("text-bg-danger text-bg-success").addClass("custom-toast");
        
        if (type === "success") {
            toastElement.css("background-color", "var(--blue)");
        } else {
            toastElement.css("background-color", "var(--raspberry)");
        }

        toastElement.find(".toast-body").text(message);
        
        let toast = new bootstrap.Toast(toastElement[0], { autohide: true, delay: 3000 });
        toast.show();
    }

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
            showToastComment("Reply must be nonempty.");
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
                    showToastComment("Reply Successfully Posted!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error replying to the reply", error);
                showToastComment("Failed to reply.");
            }
        })
    });

    function showToastReply(message, type = "danger") {
        let toastElement = $("#reply-to-reply-toast");

        toastElement.removeClass("text-bg-danger text-bg-success").addClass("custom-toast");
        
        if (type === "success") {
            toastElement.css("background-color", "var(--blue)");
        } else {
            toastElement.css("background-color", "var(--raspberry)");
        }

        toastElement.find(".toast-body").text(message);
        
        let toast = new bootstrap.Toast(toastElement[0], { autohide: true, delay: 3000 });
        toast.show();
    }

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
            showToastReply("Reply must be nonempty.");
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
                    showToastReply("Reply Successful!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error replying to the reply", error);
                showToastReply("Failed to reply.")
            }
        })
       
    })
    
})
