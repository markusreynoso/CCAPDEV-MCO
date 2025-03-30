$(document).ready(function() {
    $("#toggleDarkMode").click(function() {
        $.ajax({
            url: "/toggle-darkmode",
            type: "PUT",
            success: function(response) {
                console.log("Dark mode is now:", response.darkModeYes);
                location.reload(); 
            },
            error: function(xhr, status, error) {
                console.error("Failed to toggle dark mode:", error);
            }
        });
    });
});