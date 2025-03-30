$(document).ready(function() {

    $("#sort-comments").click(function() {

        let postId = $(this).data("post-id");

        console.log(postId);
        
        $.ajax({
            url: "/sort-comments",
            type: "PUT",
            data: JSON.stringify({ postId : postId }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    console.log("Sorted comments ascending order!", "success");  
                    
                    window.location.href = response.redirectUrl;
                   
                }
            },
            error: function (xhr, status, error) {
                console.error("Error sorting", error);
                alert("Sorting failed");
            }
        });
    })
})