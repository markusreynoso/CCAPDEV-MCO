$(document).ready(function () {

    
    
    $(".upvote-button").click(function () {
        
        let postId = $(this).data("post-id");

        let $upButton = $(this);
        let $postContainer = $upButton.closest(".post-actions-div");
        let $downButton = $postContainer.find(".downvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");
        
        $.ajax({
            url: "/upvote",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ postId: postId }),

            success: function (response) {
                if (response.success) {
                    
                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    
                    $downCountHolder.text(response.downCount.length);
                    }

                    // If user has upvoted
                    if (response.hasUpvoted) {
                        $upButton.addClass("active-up");
                        $downButton.removeClass("active-down");
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
        let $downButton = $(this);
        let $postContainer = $downButton.closest(".post-actions-div");
        let $upButton = $postContainer.find(".upvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");
        
        $.ajax({
            url: "/downvote",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ postId: postId }),

            success: function (response) {
                if (response.success) {

                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    
                    $downCountHolder.text(response.downCount.length);
                    

                    // If downCount does not contain the userId yet
                    if (response.hasDownvoted) {
                        $downButton.addClass("active-down");
                        $upButton.removeClass("active-up");
                    } else {
                        $downButton.removeClass("active-down");
                    }
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
        
        let $upButton = $(this);
        let $postContainer = $upButton.closest(".post-actions-div");
        let $downButton = $postContainer.find(".comment-downvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");

        $.ajax({
            url: "/upvote-comment",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ commentId: commentId }),
            success: function (response) {
                if (response.success) {
                    
                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    $downCountHolder.text(response.downCount.length);

                    // If upCount does not contain the userId yet
                    if (response.hasUpvoted) {
                        $upButton.addClass("active-up");
                        $downButton.removeClass("active-up");
                    } else {
                        $upButton.removeClass("active-up");
                    }
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
        
        let $downButton = $(this);
        let $postContainer = $downButton.closest(".post-actions-div");
        let $upButton = $postContainer.find(".comment-upvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");

        $.ajax({
            url: "/downvote-comment",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ commentId: commentId }),
            success: function (response) {
                if (response.success) {

                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    
                    $downCountHolder.text(response.downCount.length);

                    // If downCount does not contain the userId yet
                    if (response.hasDownvoted) {
                        $downButton.addClass("active-up");
                        $upButton.removeClass("active-up");
                    } else {
                        $downButton.removeClass("active-up");
                    }
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

        let $upButton = $(this);
        let $postContainer = $upButton.closest(".post-actions-div");
        let $downButton = $postContainer.find(".reply-downvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");

        $.ajax({
            url: "/upvote-reply",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ replyId: replyId }),
            success: function (response) {
                if (response.success) {
                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    
                    $downCountHolder.text(response.downCount.length);

                    // If upCount does not contain the userId yet
                    if (response.hasUpvoted) {
                        $upButton.addClass("active-up");
                        $downButton.removeClass("active-up");
                    } else {
                        $upButton.removeClass("active-up");
                    }
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

        let $downButton = $(this);
        let $postContainer = $downButton.closest(".post-actions-div");
        let $upButton = $postContainer.find(".reply-upvote-button");

        let $upCountHolder = $postContainer.find(".upvote-count");
        let $downCountHolder = $postContainer.find(".downvote-count");
        $.ajax({
            url: "/downvote-reply",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ replyId: replyId }),
            success: function (response) {
                if (response.success) {
                    
                    console.log("Update successful!", response);

                    $upCountHolder.text(response.upCount.length);
                    
                    $downCountHolder.text(response.downCount.length);

                    // If downCount does not contain the userId yet
                    if (response.hasDownvoted) {
                        $downButton.addClass("active-up");
                        $upButton.removeClass("active-up");
                    } else {
                        $downButton.removeClass("active-up");
                    }
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