$(document).ready(function() {

   $.get("/settings/list", function(settings) {
        const name = settings["Name"];
        const night_mode = settings["Night_Mode"];
        $("#night_mode").prop("checked", night_mode);
   })
    $("#save").click(function() {
        const name = $("#name").val();
        const nightMode = $("#night_mode").is(':checked');
        const password = $("#password").val();

        let body = {
            "Name": null,
            "Password": null,
            "Night_Mode": nightMode
        }
        if (name.trim() !== "") {
            body["Name"] = name;
        }
        if (password.trim() !== "") {
            body["Password"] = password;
        }

        $.post("/settings/edit", body, function() {
            alert("Saved!")
            location.reload();
        })
            .fail(function() {
                if (name.trim() !== "") {
                    alert("That username is taken already");
                } else {
                    alert("Server error");
                }
            })
    })
});