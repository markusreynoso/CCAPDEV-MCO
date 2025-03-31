$(document).ready(function() {
    $('#char-limit').hide();
    $("#create-post-form").submit(function(event) {

        isValid = false;
        let title = $("#write-title-area").val();
        let tag = $('#tag-text-area').val();

        if (getLength(title) <= 60 && getLength(tag) <= 20){
            isValid = true;
        }


        if (isValid === true){
            $('#char-limit').hide();
        } else {
            $("#char-limit").show();
        }

        return isValid;

    })
})

function getLength(field) {
    return field.length
}

