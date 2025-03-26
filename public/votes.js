$(document).ready(function () {

    
    
    $(".upvote-button").click(function () {
        
        let postId = $(this).data("post-id");

        let $upButton = $(this);
        let $downButton = $upButton.next().find(".downvote-button");

        let $upCount = $upButton.prev().find(".upvote-count");
        let $downCount = $upButton.next().find(".downvote-count");
        
        $.ajax({
            url: "/upvote",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ postId: postId }),

            success: function (response) {
                if (response.success) {
                    
                    console.log("Update successful!", response);

                    $upCount.text(response.upCount.length);
                    
                    $downCount.text(response.downCount.length);
                    }

                    // If upCount does not contain the userId yet
                    if ( !thePost.upCount.some(id => id.equals(currOid)) ){

                        $upButton.addClass("active-up");
                        $downButton.removeClass("active-up");
                        

                    } else {
                        $upButton.removeClass("active-up");
                    }
    
                },

            error: function (xhr, status, error) {
                    console.error("Error upvoting:", error);
                    alert("Failed to upvote the post.");
                }


        })
    });

    $(".downvote-button").click(function () {
        
        let postId = $(this).data("post-id");
        
        $.ajax({
            url: "/downvote",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ postId: postId }),

            success: function (response) {
                if (response.success) {
                    location.reload();
                    console.log("Downvote successful!", response);
                    }
    
                },
            error: function (xhr, status, error) {
                    console.error("Error downvoting:", error);
                    alert("Failed to downvote the post.");
                }


        })
    });

    $(".comment-upvote-button").click(function () {
        let commentId = $(this).data("comment-id");
        
        $.ajax({
            url: "/upvote-comment",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ commentId: commentId }),
            success: function (response) {
                if (response.success) {
                    location.reload();
                    console.log("Comment upvoted!", response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error upvoting comment:", error);
                alert("Failed to upvote the comment.");
            }
        });


    })

    $(".comment-downvote-button").click(function () {
        let commentId = $(this).data("comment-id");
        
        $.ajax({
            url: "/downvote-comment",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ commentId: commentId }),
            success: function (response) {
                if (response.success) {
                    location.reload();
                    console.log("Comment downvoted!", response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error downvoting comment:", error);
                alert("Failed to downvote the comment.");
            }
        });


    })

    $(".reply-upvote-button").click(function () {
        let replyId = $(this).data("reply-id");

        $.ajax({
            url: "/upvote-reply",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ replyId: replyId }),
            success: function (response) {
                if (response.success) {
                    location.reload();
                    console.log("Reply upvoted!", response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error upvoting reply:", error);
                alert("Failed to upvote the reply.");
            }
        });
    })

    $(".reply-downvote-button").click(function () {
        let replyId = $(this).data("reply-id");

        $.ajax({
            url: "/downvote-reply",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ replyId: replyId }),
            success: function (response) {
                if (response.success) {
                    location.reload();
                    console.log("Reply downvoted!", response);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error downvoting reply:", error);
                alert("Failed to upvote the reply.");
            }
        });
    })


    // for (let voteType of ["up", "down"]) {
    //     $(`.bi-arrow-${voteType}-short`).click(function () {
    //         let $parent = $(this).parent();
    //         let $upvoteIconElement = $parent.find(".bi-arrow-up-short").first();
    //         let $downvoteIconElement = $parent.find(".bi-arrow-down-short").first();
    //         let $upvoteCountElement = $parent.find(".upvote-count").first();
    //         let $downvoteCountElement = $parent.find(".downvote-count").first();

    //         if (voteType == "up") {
    //             // Upvoting upvoted post
    //             if ($upvoteIconElement.hasClass("active-up")) {
    //                 $upvoteIconElement.toggleClass("active-up");
    //                 $upvoteCountElement.toggleClass("active-up");
    //                 $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) - 1));
    //             }
    //             // Upvoting a downvoted post
    //             else if ($downvoteIconElement.hasClass("active-down")) {
    //                 $upvoteIconElement.toggleClass("active-up");
    //                 $downvoteIconElement.toggleClass("active-down");
    //                 $upvoteCountElement.toggleClass("active-up");
    //                 $downvoteCountElement.toggleClass("active-down");
    //                 $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) + 1));
    //                 $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) - 1));
    //             }
    //             // User has not made a vote
    //             else {
    //                 $upvoteIconElement.toggleClass("active-up");
    //                 $upvoteCountElement.toggleClass("active-up");
    //                 $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) + 1));
    //             }
    //         }
    //         else {
    //             // Downvoting upvoted post
    //             if ($upvoteIconElement.hasClass("active-up")) {
    //                 $upvoteIconElement.toggleClass("active-up");
    //                 $upvoteCountElement.toggleClass("active-up");
    //                 $downvoteCountElement.toggleClass("active-down");
    //                 $downvoteIconElement.toggleClass("active-down");
    //                 $upvoteCountElement.text(String(parseInt($upvoteCountElement.text()) - 1));
    //                 $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) + 1));

    //             }
    //             // Downvoting a downvoted post
    //             else if ($downvoteIconElement.hasClass("active-down")) {
    //                 $downvoteCountElement.toggleClass("active-down");
    //                 $downvoteIconElement.toggleClass("active-down");
    //                 $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) - 1));
    //             }
    //             // User has not made a vote
    //             else {
    //                 $downvoteIconElement.toggleClass("active-down");
    //                 $downvoteCountElement.toggleClass("active-down");
    //                 $downvoteCountElement.text(String(parseInt($downvoteCountElement.text()) + 1));
    //             }
    //         }
    //     })
    // };
})