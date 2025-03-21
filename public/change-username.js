$(document).ready(function() {
    $("#confirm-new-username").click(function(event) {
        let url = "/change-username";
        let newUsername = $("#username-text-area").val();
        alert(newUsername);

        $.ajax({
            url: url,
            type: 'PUT',
            data: {"username": newUsername},
            complete: function(result) {
                // window.location.href='/users/' + newUsername + "/posts";
            }
        })
    })
})