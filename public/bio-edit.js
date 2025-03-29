$(document).ready(function () {

    function showToast(message, type = "danger") {
        let toastElement = $("#bioToast");

        toastElement.removeClass("text-bg-danger text-bg-success").addClass("custom-toast");
        
        if (type === "success") {
            toastElement.css("background-color", "var(--blue)");
        } else {
            toastElement.css("background-color", "var(--raspberry)");
        }

        toastElement.find(".toast-body").text(message);
        
        let toast = new bootstrap.Toast(toastElement[0], { autohide: true, delay: 3000 });
        toast.show();
    }

    
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });

    $("#edit-bio-save-changes-btn").click(function(event) {
        event.preventDefault();

        let newBio = $("#bio-text-area").val();
        
        if (newBio.length > 500) {
            showToast("Max 500 characters");
            return;
        }

        $.ajax({
            url: "/change-bio",
            type: "PUT",
            data: JSON.stringify({ newBio : newBio }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    showToast("Password Successfully Changed!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating bio", error);
                showToast("Failed to change bio.");
            }
        })
    });

    $("#edit-username-btn").click(function () {
        let currUsername = $("h3.post-username").first().text()
        $("#username-text-area").val(currUsername)
    });
});


