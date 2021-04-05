function catalogClickHandler() {
    // We use this class to hold all the catalog previews on home page and trending and mycatalogs
    // Need if statement so you can only click on grid-items while one these certain pages
    let catalogEntry = $(".grid-item");
    //if(window.location == "/" || window.location == "/trending" || window.location == "/catalogs") {
    catalogEntry.click(function (event) {
        //this event target will differentiate the catalogs from each other, and show which specific element was clicked

        const id = $(this).attr("id");
        window.location = "/catalog/" + id;
    });
}