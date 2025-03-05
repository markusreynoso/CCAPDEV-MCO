$(document).ready(function() {
    $(".bi-pencil").click(function(){
        let parent = $(this).closest(".post");
        let postContent = parent.find("p.post-body-text").text().trim();
        let postTitle = parent.find("h2.post-title").text().trim();
        
        if ($(this).hasClass("post-edit-flag")){
            $("#edit-post-text-area").val(postContent);
            $("#edit-post-title-area").val(postTitle);
        }
    });
})