$(document).ready(function () {

    // Logic for updating scores when upvoting and downvoting
    for (let voteType of ["up", "down"]) {
        $(`.bi-arrow-${voteType}-short`).click(function () {
            let $parent = $(this).parent();
            let $upvoteIconElement = $parent.find(".bi-arrow-up-short").first();
            let $downvoteIconElement = $parent.find(".bi-arrow-down-short").first();
            let $upvoteCountElement = $parent.find(".upvote-count").first();
            let $downvoteCountElement = $parent.find(".downvote-count").first();

            if (voteType == "up") {
                // Upvoting upvoted post
                if ($upvoteIconElement.hasClass("active-up")) {
                    $upvoteIconElement.toggleClass("active-up");
                    $upvoteCountElement.toggleClass("active-up");
                    $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) - 1));
                }
                // Upvoting a downvoted post
                else if ($downvoteIconElement.hasClass("active-down")) {
                    $upvoteIconElement.toggleClass("active-up");
                    $downvoteIconElement.toggleClass("active-down");
                    $upvoteCountElement.toggleClass("active-up");
                    $downvoteCountElement.toggleClass("active-down");
                    $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) + 1));
                    $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) - 1));
                }
                // User has not made a vote
                else {
                    $upvoteIconElement.toggleClass("active-up");
                    $upvoteCountElement.toggleClass("active-up");
                    $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) + 1));
                }
            }
            else {
                // Downvoting upvoted post
                if ($upvoteIconElement.hasClass("active-up")) {
                    $upvoteIconElement.toggleClass("active-up");
                    $upvoteCountElement.toggleClass("active-up");
                    $downvoteCountElement.toggleClass("active-down");
                    $downvoteIconElement.toggleClass("active-down");
                    $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) - 1));
                    $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) + 1));

                }
                // Downvoting a downvoted post
                else if ($downvoteIconElement.hasClass("active-down")) {
                    $downvoteCountElement.toggleClass("active-down");
                    $downvoteIconElement.toggleClass("active-down");
                    $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) - 1));
                }
                // User has not made a vote
                else {
                    $downvoteIconElement.toggleClass("active-down");
                    $downvoteCountElement.toggleClass("active-down");
                    $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) + 1));
                }
            }
        })
    };

    // Post editing logic
    $(".bi-pencil").click(function(){
        let parent = $(this).closest(".post");
        let postContent = parent.find("p.post-body-text").text().trim();
        let postTitle = parent.find("h2.post-title").text().trim();
        
        if ($(this).hasClass("post-edit-flag")){
            $("#edit-post-text-area").val(postContent);
            $("#edit-post-title-area").val(postTitle);
        }
    });

    // Replying logic
    $(".bi-reply").click(function(){
        let parent = $(this).closest(".card-body");
        let replyingTo = parent.find("h3.post-username").text();
        
        $("#edit-reply-comment-text-area").val(`@${replyingTo} `)
    });

    // edit comment logic
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