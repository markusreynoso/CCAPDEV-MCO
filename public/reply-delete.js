$(document).ready(function() {
    
    $(document).on("click", ".delete-reply-button", function () {
        let commentId = $(this).data("comment-id");
        let replyId = $(this).data("reply-id"); 
        $("#delete-reply").data("comment-id", commentId);
        $("#delete-reply").data("reply-id", replyId); 
    });

    $("#delete-reply").click(function() {
        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let replyId = $(this).data("reply-id");


        $.ajax({
            url: "/delete-reply",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                replyId: replyId
            }),
            contentType: "application/json",
            success: function(result) {
                console.log("Success deleting reply! " + result)
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting reply", error);
                alert("Failed to delete reply.")
            }
        })
    })

})