$(document).ready(function() {
    $("#register-warning").hide();
    $("#register-form").submit(function(event) {

        let isValid = false;

        let username = $("#username-field").val();
        let pass1 = $("#password-field").val();
        let pass2 = $("#confirmation-field").val();

        userValid = validateUsername(username);
        passValid = validatePassword(pass1, pass2);
        
        if (userValid === true && passValid === true){
            $('#register-warning').hide();
        } else {
            $("#register-warning").show();
        }
        return isValid;
    })
})

function getLength(field) {
    return field.length
}

function validateUsername(username){
    let isValid = false;

    let usernameLen = getLength(username);

    if (usernameLen >= 5 && usernameLen <= 20){
        isValid = true;
    }

    // whitespace checker
    if (username.indexOf(' ') == 0){
        isValid = true;
    }

    alert("Username: " + isValid)
    return isValid;
}

function validatePassword(pass1, pass2){
    let isValid = true;

    let passLen = getLength(pass1);

    if (pass1 != pass2){
        return false;
    }

    // checks for whitespace
    if (pass1.indexOf(' ') > 0){
        return false;
    }

    if (passLen <= 10 || passLen >= 20){
        return false;
    }

    // check if password contains 
    // contains at least 1 capital character, 1 small character,
    //  1 number, and 1 symbol
    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    isValid = regex.test(pass1);
    
    alert("password:" + isValid);
    return isValid;
}
