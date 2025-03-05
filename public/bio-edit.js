$(document).ready(function () {
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });

    $("#change-pic-btn").click(function () {
        $("#img-input").click();
    })
})