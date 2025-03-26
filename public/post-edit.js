$(document).ready(function() {

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
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error editing post", error);
                alert("Failed to edit post.")
            }
        })
       

    })


})