$(document).ready(function () {
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);
    })

    $("#save-bio-btn").click(function () {
        let newBio = $('#bio-text-area').val().trim().replace(/\s+/g, ' ');
        console.log(newBio)
        $.ajax({
            url: '/change-bio',
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                newBio: newBio
            }),

            success: function (response) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating Bio:", error);
                alert("Failed to update bio.");
            }
        }
        )
    }
    )
}
)