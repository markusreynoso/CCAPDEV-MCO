$(document).ready(function () {
    
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });

    $("#edit-bio-save-changes-btn").click(function(event) {
        event.preventDefault();

        let newBio = $("#bio-text-area").val();
        
        $.ajax({
            url: "/change-bio",
            type: "PUT",
            data: JSON.stringify({ newBio : newBio }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating username", error);
                alert("Failed to change username.")
            }
        })
    });

    $("#edit-username-btn").click(function () {
        let currUsername = $("h3.post-username").first().text()
        $("#username-text-area").val(currUsername)
    });
});