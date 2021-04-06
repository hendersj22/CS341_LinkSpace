//This is assuming that we've already SEE the catalog (using viewCatalog)
//We also need to create a button for editting the text named "editButton"

//Something to consider (before I forget) we may need to edit each URL one by one, saving it one by one, then saving the whole after.

$( document ).ready(function() {

    var pathnameInfoString = location.pathname;
    var newPath = pathnameInfoString.replace("edit/", "info");

    $.get(newPath, function(catalogInfo) {
        $('.catalog_title').attr("value", catalogInfo["Name"]);
    });
});