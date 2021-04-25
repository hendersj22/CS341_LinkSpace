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

function editCatalogClickHandler() {
    let editButton = $("#edit");
    editButton.click(function() {
        $.get(location.pathname + "/info", function(catalogInfo) {
            var idEdit = catalogInfo["Catalog_ID"];
            window.location = "/catalog/" + idEdit + "/edit/";
        })
        .fail(function() {
            alert("Server error");
        });
    });
}

function deleteCatalogClickHandler() {
    let deleteButton = $("#delete");
   
    deleteButton.click(function() {
        $.post(location.pathname + "/delete", function(idDelete) {
            window.location = "/"
        })
        .fail(function() {
            alert("You cannot delete someone else's catalog.");
        });
    });
}