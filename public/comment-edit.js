$(document).ready(function() {
    $(".post-edit-flag").click(function() {
        let id = $(this).attr("value");
        let element = $(".card-body[value='" + id + "']") // $(".card-body[value='67bc87de16350e278a7aaaad']")
                        .find('p.post-body-text');

        let isComment = element.children().length === 0;
        let content;
        if (isComment) {
            content = element.html().trim();
        }

        else {
            let mention = element.children().find("a").html().trim();
            content = mention + " " + element.clone().children().remove().end().text().trim();
        }
        
        $("#edit-comment-text-area").html(content);
    });

    $("#edit-bio-btn").click(function() {
        let bio = $('#bioContent').text().trim().replace(/\s+/g, ' ');
        $("#bio-text-area").html(bio);

    });
})