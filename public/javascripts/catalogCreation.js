function isValidLink(link) {
    const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
    return link.match(regex);
}

$(document).ready(function() {

    // Create more link boxes to add more than one link
    $("#addLinks").click(function addNewLink() {
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
    })

    $("#save").click(function() {
        const title = $(".catalog_title").val();
        let urls = $(".catalog_link");
        let descriptions = $(".catalog_description");
        
        let reqBody = {
            "Name": title,
            "Links": []
        };

        let canSubmit = true;

        for(let i = 0; i < urls.length; i++){
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

            let link = {
                "URL": url,
                "Description": description
            }
            reqBody["Links"].push(link);
        }

        if (canSubmit) {
            $.post("/catalog/create", reqBody, function(catalogID) {
                window.location = "/catalog/" + catalogID;
            })
                .fail(function() {
                    alert("Couldn't create catalog")
                })
        }
    })
})