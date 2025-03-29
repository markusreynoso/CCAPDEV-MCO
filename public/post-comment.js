
$(document).ready(function () {

    function showToast(message, type = "danger") {
        let toastElement = $("#commentToast");

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

    $("#post-comment-btn").click(function(event) {
        event.preventDefault();
        
        let postId = $(this).data("post-id");
        let commentContent = $("#write-text-area").val();

        if (!commentContent){
            showToast("Comment must be nonempty");
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
                    showToast("Post Comment Success!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error posting comment", error);
                showToast("Failed to post comment.")
            }
        })
    })

    $("#cancel-comment-btn").click(function(event) {
        //TODO clearing of text inputted

        $("#write-text-area").val("");
    })
})