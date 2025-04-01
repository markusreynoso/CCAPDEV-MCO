$(document).ready(function () {
    $("#register-warning").hide();

    $("#register-form").submit(function (event) {
        let username = $("#username-field").val();
        let pass1 = $("#password-field").val();
        let pass2 = $("#confirmation-field").val();

        let userValid = validateUsername(username);
        let passValid = validatePassword(pass1, pass2);
       

        if (userValid && passValid) {
            $('#register-warning').hide();
        } else {
            event.preventDefault();
            $("#register-warning").show();
        }
    });

})

function getLength(field) {
    return field.length
}

function validateUsername(username) {
    let isValid = false;

    let usernameLen = getLength(username);

    if (usernameLen >= 5 && usernameLen <= 20) {
        isValid = true;
    }

    // whitespace checker
    if (/\s/.test(username)) { 
        isValid = false;
    }


    return isValid;
}

function validatePassword(pass1, pass2) {
    let isValid = true;

    let passLen = getLength(pass1);

    if (pass1 != pass2) {
        return false;
    }

    // checks for whitespace
    if (/\s/.test(pass1)) {
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
