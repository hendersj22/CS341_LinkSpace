function isValidLink(link) {
    const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    return link.match(regex);
}

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
        title.setAttribute("type", "textCatalogTitle");
        title.setAttribute("class", "catalog_title");
        title.setAttribute("Placeholder", "Add Title");

        document.getElementById('catalog').appendChild(title);
        $('.catalog_title').attr("value", catalogInfo["Name"]);

        var linksArrayLength = catalogInfo.Links.length;
        for(let i = 0; i < linksArrayLength; i++)
        {
            console.log(catalogInfo["Links"][i]);
            let entryID = catalogInfo["Links"][i].Entry_ID;
            let url = catalogInfo["Links"][i].URL;
            let descriptionName = catalogInfo["Links"][i].Description;

            var link = document.createElement("input");
            link.setAttribute("name", entryID);
            link.setAttribute("type", "textCatalog"); 
            link.setAttribute("class", "catalog_link");
            link.setAttribute("Placeholder", "Add Link");
            var description = document.createElement("input");
            link.setAttribute("name", entryID);
            description.setAttribute("type", "textCatalog"); 
            description.setAttribute("class", "catalog_description");
            description.setAttribute("Placeholder", "Add Description");
            document.getElementById('catalog_entry').appendChild(link);
            document.getElementById('catalog_entry').appendChild(description);

            link.setAttribute("value", url);
            description.setAttribute("value", descriptionName);

            initialEntryCount++;
        }
    });

    $("#addLinksEdit").click(function addNewLink() {
        var link = document.createElement("input");
        link.setAttribute("type", "textCatalog"); 
        link.setAttribute("class", "catalog_link");
        link.setAttribute("Placeholder", "Add Link");
        var description = document.createElement("input");
        description.setAttribute("type", "textCatalog"); 
        description.setAttribute("class", "catalog_description");
        description.setAttribute("Placeholder", "Add Description");
        document.getElementById('catalog_entry').appendChild(link);
        document.getElementById('catalog_entry').appendChild(description);
    });

    $("#saveEdit").click(function() {
        const title = $(".catalog_title").val();
        var urls = $(".catalog_link");
        var descriptions = $(".catalog_description");
        
        var reqBody = {
            "Name": title,
            "Links": []
        };

        let canSubmit = true;

        for(let i = 0; i < urls.length; i++){
            let entryID = urls[i].name;
            let url = urls[i].value;
            let description = descriptions[i].value;

            if (url.trim() === "" || description.trim() === "") {
                alert(`There are empty fields`);
                canSubmit = false;
                break;
            }

            if (!isValidLink(url)) {
                alert(`${url} is not a valid URL`);
                canSubmit = false;
            }

            if (!entryID) entryID = undefined;

            let link = {
                "Entry_ID": entryID,
                "URL": url,
                "Description": description
            }
            reqBody["Links"].push(link);
        }

        if (canSubmit) {
            $.post(location.pathname, reqBody, function() {
                window.location = endingPath;
            })
                .fail(function() {
                    alert("Couldn't edit catalog")
                })
        }
    })
});