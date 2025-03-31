$(document).ready(function() {

    function showToast(message, type = "danger") {
        let toastElement = $("#posteditToast");

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

    $(".bi-pencil").click(function(){
        let parent = $(this).closest(".post");
        let postContent = parent.find("p.post-body-text").text().trim();
        let postTag = parent.find("div.tag p").text();
        let postTitle = parent.find("h2.post-title").text().trim();
        
        
        if ($(this).hasClass("post-edit-flag")){
            $("#edit-post-text-area").val(postContent);
            $("#edit-post-title-area").val(postTitle);
            $("#edit-post-tag-area").val(postTag);
        }
    });

    $("#edit-post-save-changes").click(function(event) {
        event.preventDefault();

        let newTitle = $("#edit-post-title-area").val();
        let newTag = $("#edit-post-tag-area").val();
        let newContent = $("#edit-post-text-area").val();
        let postId = $(this).data("post-id");

        if (!newTitle) {
            showToast("Title must be nonempty.");
            return;
        }

        if (!newTag) {
            showToast("Tag must be nonempty.");
            return;
        }

        if (!newContent) {
            showToast("Content must be nonempty.");
            return;
        }


        if (newTag.length > 20){
            showToast("Tag (Max 20 characters)");
            return;
        }

        if (newTitle.length > 60){
            showToast("Title (Max 60 characters)");
            return;
        }

        
        $.ajax({
            url: "/change-post",
            type: "PUT",
            data: JSON.stringify({ 
                postId: postId,
                newTitle: newTitle, 
                newTag: newTag, 
                newContent: newContent}),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    showToast("Post Successfully Changed!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error editing post", error);
                showToast("Failed to edit post.")
            }
        })
       

    })


})