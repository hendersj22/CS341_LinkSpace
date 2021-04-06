//This is assuming that we've already SEE the catalog (using viewCatalog)
//We also need to create a button for editting the text named "editButton"

//Something to consider (before I forget) we may need to edit each URL one by one, saving it one by one, then saving the whole after.
$( document ).ready(function() {

    // these are editing the pathname of the location, so that we can: get info on the catalog and also send to the catalog after edit are done
    var pathnameInfoString = location.pathname;
    var newPath = pathnameInfoString.replace("edit/", "info");
    var endingPath =pathnameInfoString.replace("edit/","");
    let initialEntryCount = 0;

    // get Request to edit values on the edit page
    $.get(newPath, function(catalogInfo) {
        var title = document.createElement("input");
        title.setAttribute("type", "text");
        title.setAttribute("class", "catalog_title");
        title.setAttribute("Placeholder", "Add Title");

        document.getElementById('catalog').appendChild(title);
        $('.catalog_title').attr("value", catalogInfo["Name"]);

        var linksArrayLength = catalogInfo.Links.length;
        for(let i = 0; i < linksArrayLength; i++)
        {
            let url = catalogInfo["Links"][i].URL;
            let descriptionName = catalogInfo["Links"][i].Description;

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

            link.setAttribute("value", url);
            description.setAttribute("value", descriptionName);

            initialEntryCount++;
        }

    });

    $("#addLinksEdit").click(function addNewLink() {
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
    });

    $("#saveEdit").click(function() {
        const title = $(".catalog_title").val();
        var urls = $(".catalog_link");
        var descriptions = $(".catalog_description");
        
        var reqBody = {
            "Name": title,
            "Links": []
        };

        for(let i = initialEntryCount; i < urls.length; i++){
            let url = urls[i].value;
            let description = descriptions[i].value;
            console.log(url);  

            let link = {
                //"Entry_ID": (we need entry_id but don't know how to get it from where we get)
                "URL": url,
                "Description": description
            }
            reqBody["Links"].push(link);
        }

        $.post(location.pathname, reqBody, function() {
            window.location = endingPath;
        })
        .fail(function() {
            alert("Couldn't edit catalog")
        })

    })
});