$(document).ready(function () {
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
})