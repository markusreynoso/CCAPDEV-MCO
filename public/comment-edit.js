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
        
        $("#edit-comment-text-area").html(content);
    });
    
    $(document).on("click", ".edit-comment-button", function () {
        let commentId = $(this).data("comment-id"); 
        $("#edit-comment-save-changes").data("comment-id", commentId); 
    });

    $("#edit-comment-save-changes").click(function(event) {
        event.preventDefault();
        let postId = $(this).data("post-id");
        let commentId = $(this).data("comment-id");
        let newComment = $("#edit-comment-text-area").val();

        if (!newComment) {
            alert("Edit must be nonempty.");
            return;
        }

        $.ajax({
            url: "/change-comment",
            type: "PUT",
            data: JSON.stringify({
                postId: postId,
                commentId: commentId,
                newComment: newComment
            }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error editing comment", error);
                alert("Failed to edit comment.")
            }

        })
        
    })

    
})