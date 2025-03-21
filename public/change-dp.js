$(document).ready(function() {
    $(".btn-select-dp").click(function() {
        const selectedDpUrl = $(this).data("img-url");
        
        $.ajax({
            url: "/change-dp",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                selectedDp: selectedDpUrl
                }),

            success: function (response) {
            if (response.success) {
                window.location.href = response.redirectUrl;
                }

            },
            error: function (xhr, status, error) {
                console.error("Error updating profile picture:", error);
                alert("Failed to update profile picture.");
                }
    
        })
    })
})