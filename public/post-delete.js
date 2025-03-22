$(document).ready(function() {
    $("#delete-post").click(function(event) {
        let url = $(location).attr('href');

        $.ajax({
            url: url,
            type: 'DELETE',
            data: null,
            complete: function(result) {
                window.location.href='/home'
            }
        })
    })
})