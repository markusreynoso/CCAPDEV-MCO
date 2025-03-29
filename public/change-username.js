$(document).ready(function() {
    $("#change-username-save-changes-btn").click(function(event) {
        event.preventDefault();

        let newUsername = $("#username-text-area").val();
        
        $.ajax({
            url: "/change-username",
            type: "PUT",
            data: JSON.stringify({ newUsername : newUsername }),
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
    })
})