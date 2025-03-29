$(document).ready(function() {
    $("#change-username-save-changes-btn").click(function(event) {
        event.preventDefault();

        let newUsername = $("#username-text-area").val();
        
        if (newUsername.length < 5 || newUsername.length > 10){
            alert("Username must be 5 - 10 characters");
            return;
        }
        
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