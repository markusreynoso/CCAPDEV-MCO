$(document).ready(function() {
    $("#delete-post").click(function(event) {
        let url = $(location).attr('href');

        $.ajax({
            url: url,
            type: 'DELETE',
            data: null,
            complete: function(result) {
                console.log("Success deleting post! " + result)
                window.location.href='/home'
            }
        })
    })
})