
$(document).ready(function () {

    $("#post-comment-btn").click(function(event) {
        event.preventDefault();
        
        let postId = $(this).data("post-id");
        let commentContent = $("#write-text-area").val();

        if (!commentContent){
            alert("Comment must be nonempty");
            return;
        }
        
        $.ajax({
            url: "/comments",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentContent: commentContent
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error editing post", error);
                alert("Failed to edit post.")
            }
        })
    })

    $("#cancel-comment-btn").click(function(event) {
        //TODO clearing of text inputted
    })
})