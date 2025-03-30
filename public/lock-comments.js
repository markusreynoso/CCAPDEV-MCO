$(document).ready(function(){
    $("#lock-comments-btn").click(function(){
        let postId = $(this).data('post-id');
        $.ajax({
            url: '/lock-comments',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({postId: postId}),
            success: function( response ) {
                if (response.success) {                  
                    window.location.href = `/posts/${postId}`;
                }
            },
            error: function (xhr, status, error) {
                alert("Failed");
            }
        })
    })
})