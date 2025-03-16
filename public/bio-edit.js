$(document).ready(function () {
    $("#edit-bio-btn").click(function () {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });

    $(".btn-select-dp").click(function(){
        const imgUrl = $(this).attr('data-img-url');
        //ToDo: Add logic here
        // Send put http put request
    })

    $("#edit-username-btn").click(function () {
        let currUsername = $("h3.post-username").first().text()
        $("#username-text-area").val(currUsername)
    })
})