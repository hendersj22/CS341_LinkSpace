$(document).ready(function() {
    $("#submit").click(function() {
        const username = $("#username").val();
        const password = $("#password").val();
        if (username && password) {
            $.post("/login/check", {"Name": username, "Password": password}, function() {
                window.location = "/";
            })
            .fail(function() {
                alert("Incorrect username / password");
            })
        }
    });

    $("#signup").click(function() {
        window.location = "/signup";
    })
})