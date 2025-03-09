$(document).ready(function () {
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });

    $("#change-pic-btn").click(function () {
        $("#img-input").click();
    })

    $("#edit-username-btn").click(function () {
        let currUsername = $("h3.post-username").first().text()
        $("#username-text-area").val(currUsername)
    })
})