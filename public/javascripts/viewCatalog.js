$(document).ready(function() {

    // We use this class to hold all the catalog previews on home page and trending and mycatalogs
    // Need if statement so you can only click on grid-items while one these certain pages
    let catalogEntry = $(".grid-item");
    if(window.location == "/" || window.location == "/trending" || window.location == "/catalogs") {
        catalogEntry.click(function(event) {
            //this event target will differentiate the catalogs from each other, and show which specific element was clicked

            console.log(event.target.id);

            //this is assuming the (event.target.id == the catalog id) through another script
            $.get("/catalogs/" + event.target.id + "/info", function(catalogInfo) {
                window.location = "/catalogs/" + catalogInfo["Catalog_ID"];
                $(".catalog_title").text(catalogInfo["Name"]);
                $(".catalog_author").text(catalogInfo["Author"]); // need to add this to the response body

                //iterate through the array of links, where we only care about the URL and description
                var linksArrayLength = catalogInfo.Links.length;
                for(let i = 0; i < linksArrayLength; i++)
                {
                    let url = catalogInfo["Links"][i].URL;
                    let description = catalogInfo["Links"][i].Description;

                    var link = $('<a />');
                    link.attr('href', url);
                    link.text(url); // there's two options for our entries. Do we want the hyperlinked text to be of the whole URL, or the description?

                    var entryDescription = $('<p />');
                    entryDescription.text(description);

                    $(".catalog").append(link);
                    $(".catalog").append(entryDescription);
                }
            })
            .fail(function() {
                alert("Server error");
            });
        });
    }
    // Assuming this page's url is linkspace.com/catalogs/{idOfChosen}
});