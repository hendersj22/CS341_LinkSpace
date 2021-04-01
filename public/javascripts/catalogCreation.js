$(document).ready(function() {

    // Create more link boxes to add more than one link
    // MAKE IT MORE PRETTY
    $("#addLinks").click(function() {
        var input = document.createElement("input");
        input.setAttribute("type", "text"); 
        input.setAttribute("class", "catalog_link");
        document.getElementById('catalog').appendChild(input);
    })

    $("#save").click(function() {
        const title = $(".catalog_title").val();
        var urls = $(".catalog_link");
        var descriptions = $(".catalog_description");
        
        var reqBody = {
            "Name": title,
            "Links": []
        }
        
        for(let i = 0; i < urls.length; i++){
            let url = urls[i].value;
            //let description = descriptions[i].value;
            console.log(url);  

            let link = {
                "URL": url,
                //"Description": description
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