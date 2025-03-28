$(document).ready(function() {
    $(document).on("click", ".delete-comment-button", function () {
        let commentId = $(this).data("comment-id"); 
        $("#delete-comment").data("comment-id", commentId); 
    });

    $("#delete-comment").click(function(event) {
        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");

        $.ajax({
            url: "/delete-comment",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId
            }),
            contentType: "application/json",
            success: function(result) {
                console.log("Success deleting comment! " + result)
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting comment", error);
                alert("Failed to delete comment.")
            }
        })
    })
})