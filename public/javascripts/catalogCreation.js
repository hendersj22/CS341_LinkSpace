$(document).ready(function() {

    // Create more link boxes to add more than one link
    // MAKE IT MORE PRETTY
    $("#addLinks").click(function() {
        var link = document.createElement("input");
        link.setAttribute("type", "text"); 
        link.setAttribute("class", "catalog_link");
        link.setAttribute("Placeholder", "Add Link");
        var description = document.createElement("input");
        description.setAttribute("type", "text"); 
        description.setAttribute("class", "catalog_description");
        description.setAttribute("Placeholder", "Add Description");
        document.getElementById('catalog').appendChild(link);
        document.getElementById('catalog').appendChild(description);
    })

    $("#save").click(function() {
        const title = $(".catalog_title").val();
        var urls = $(".catalog_link");
        var descriptions = $(".catalog_description");
        
        var reqBody = {
            "Name": title,
            "Links": []
        };

        for(let i = 0; i < urls.length; i++){
            let url = urls[i].value;
            let description = descriptions[i].value;
            console.log(url);  

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