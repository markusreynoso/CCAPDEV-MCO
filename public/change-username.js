$(document).ready(function() {
    
    function showToast(message, type = "danger") {
        let toastElement = $("#usernameToast");

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

    $("#change-username-save-changes-btn").click(function(event) {
        event.preventDefault();

        let newUsername = $("#username-text-area").val();
        
        if (newUsername.length < 5 || newUsername.length > 20){
            showToast("Username must be 5 - 20 characters");
            return;
        }

        if (/\s/.test(newUsername)) { 
            showToast("There must be no whitespace");
            return;
        }
        
        $.ajax({
            url: "/change-username",
            type: "PUT",
            data: JSON.stringify({ newUsername : newUsername }),
            contentType: "application/json",
            success: function( response ) {
                if (response.success) {
                    showToast("Username Successfully Changed!", "success");  
                    setTimeout(() => {
                        window.location.href = response.redirectUrl;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating username", error);
                showToast("Username already exists.");
            }
        });
    });
});
