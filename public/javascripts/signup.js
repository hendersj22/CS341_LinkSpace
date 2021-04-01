$(document).ready(function() {
    $("#submit").click(function() {
        const username = $("#username").val();
        const password = $("#password").val();
        if (username && password) {
            $.post("/signup/new-user", {"Name": username, "Password": password}, function() {
                window.location = "/";
            })
            .fail(function() {
                alert("Username taken already");
            })
        }
    });

    $("#login").click(function() {
        window.location = "/login";
    })
})