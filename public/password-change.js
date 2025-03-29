$(document).ready(function() {
    $("#change-password-save-changes-btn").click(function(event) {
        event.preventDefault();

        let oldPassword = $("#old-password-text-area").val();
        let newPassword = $("#new-password-text-area").val();
        let confirmNewPassword = $("#new-password-confirm-text-area").val()

        let passValid = validatePassword(newPassword);

        if (newPassword != confirmNewPassword){
            showToast("New password mismatch to confirm new password");
            return;
        }
        if (!passValid){
            showToast("Password must be:<br> • 10-20 characters<br> • 1 uppercase letter<br> • 1 lowercase letter<br> • 1 number<br> • 1 symbol");
            return;
        }

       $.ajax({
        url: "/change-password",
        type: "PUT",
        data: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword
            
        }),
        contentType: "application/json",
        success: function( response ) {
            if (response.success) {

                showToast("Password Successfully Changed!", "success");  
                setTimeout(() => {
                    location.reload();
                }, 1000);


                }
        },

        error: function (xhr, status, error) {
            console.error("Error changing password", error);
            showToast("Failed to change password.")
        }

       })


    });

    
});

function showToast(message, type = "danger") {
    let toastElement = $("#passwordToast");

    
    // toastElement.removeClass("text-bg-danger text-bg-success").addClass(`text-bg-${type}`);
    toastElement.removeClass("text-bg-danger text-bg-success").addClass("custom-toast");

    if (type === "success") {
        toastElement.css("background-color", "var(--blue)");
    } else {
        toastElement.css("background-color", "var(--raspberry)");
    }
    
    
    toastElement.find(".toast-body").html(message);

   
    let existingToast = bootstrap.Toast.getInstance(toastElement[0]);
    if (existingToast) {
        existingToast.dispose();
    }

    let toast = new bootstrap.Toast(toastElement[0]);
    toastElement.addClass("show"); 
    toast.show();

}

function getLength(field) {
    return field.length
}


function validatePassword(pass1) {
    let isValid = true;

    let passLen = getLength(pass1);

    // checks for whitespace
    if (pass1.indexOf(' ') > 0) {
        return false;
    }

    if (passLen <= 10 || passLen >= 20) {
        return false;
    }

    // check if password contains 
    // contains at least 1 capital character, 1 small character,
    //  1 number, and 1 symbol
    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    isValid = regex.test(pass1);

    return isValid;
}