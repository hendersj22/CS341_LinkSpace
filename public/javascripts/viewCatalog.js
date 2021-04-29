$(document).ready(function() {
    //this is assuming the (event.target.id == the catalog id) through another script
    $.get(location.pathname + "/info", function(catalogInfo) {
        $(".catalog_title").text(catalogInfo["Name"]);
        $(".catalog_author").text("Made by: " + catalogInfo["Author"]);

        //iterate through the array of links, where we only care about the URL and description
        var linksArrayLength = catalogInfo.Links.length;
        for(let i = 0; i < linksArrayLength; i++)
        {
            let url = catalogInfo["Links"][i].URL;
            let description = catalogInfo["Links"][i].Description;

            const urlHTML = `<a class="catalog_link" href="${url}">${url}</a>`
            const descriptionHTML = `<p class="catalog_description">${description}</p>`

            $(".catalog_entries").append(urlHTML);
            $(".catalog_entries").append(descriptionHTML);
        }
        editCatalogClickHandler();
        deleteCatalogClickHandler();
    })
        .fail(function() {
            alert("Server error");
        });
});