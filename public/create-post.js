$(document).ready(function() {
    $("#create-post-form").submit(function(event) {
        let user = $("#loggedInUser").attr("src");
        $("#posted-by").html(user);

    })
})