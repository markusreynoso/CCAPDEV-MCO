$(document).ready(function() {

    $("#create-post-form").submit(function(event) {

        isValid = false;
        let title = $("#write-title-area").val();
        let tag = $('#tag-text-area').val();
        let postContent = $('#write-text-area').val();

        

        if (getLength(title) <= 60 && getLength(tag) <= 12){
            isValid = true;
        }

        
        // if (getLength(title) === 0 && getLength(tag) === 0 && getLength(postContent) === 0){
        //     isValid = false;

        // }

        if (isValid === true){
            alert("True")
            $('p').hide();
            
        }

        else {
            alert("False")
            $("p").show();
        }

        return false;

    })
})

function getLength(field) {
    return field.length
}

