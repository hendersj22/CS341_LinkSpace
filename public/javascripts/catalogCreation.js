$(document).ready(function() {

    $(".catalog_add").click(function() {

    });

    $("#save").click(function() {
        const title = $(".catalog_title").val();
        var urls = $(".catalog_link");
        var descriptions = $(".catalog_description");

        var reqBody = {
            "Name": title,
            "Links": []
        }

        for(let i = 0; i < urls.length; i++){
            let url = urls[i].val();
            let description = descriptions[i].val();

            let link = {
                "URL": url,
                "Description": description
            }
            reqBody["Links"].push(link);
        }


        $.post("/catalog/create", reqBody, function(catalogID) {
            window.location = "/catalog/" + catalogID;
        })
        .fail(function() {
            alert("Couldn't create catalog")
        })
    })
})