$(document).ready(function() {
    $(".post-edit-flag").click(function() {
        let id = $(this).attr("value");
        let element = $(".card-body[value='" + id + "']") // $(".card-body[value='67bc87de16350e278a7aaaad']")
                        .find('p.post-body-text');
        
        let isComment = element.children().length === 0;
        let content;
        if (isComment) {
            content = element.html().trim();
        }

        else {
            let mention = element.children().find("a").html().trim();
            content = mention + " " + element.clone().children().remove().end().text().trim();
        }
        
        $("#edit-reply-text-area").html(content);
    });

    $(document).on("click", ".edit-reply-button", function () {
        let commentId = $(this).data("comment-id"); 
        let replyId = $(this).data("reply-id"); 
        $("#edit-reply-save-changes").data("comment-id", commentId); 
        $("#edit-reply-save-changes").data("reply-id", replyId); 
    });

    $("#edit-reply-save-changes").click(function(event) {
        event.preventDefault();

        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let replyId = $(this).data("reply-id");
        let newReply = $("#edit-reply-text-area").val();

        // alert(postId);
        // alert(commentId);
        // alert(replyId);
       

        $.ajax({
            url: "/change-reply",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                replyId: replyId,
                newReply: newReply
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error editing reply", error);
                alert("Failed to edit reply.")
            }

        })
    })
})