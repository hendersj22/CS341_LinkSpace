
$(document).ready(function() {


    // TODO: find out id for the copy catalog button, #copyCatalog is a placeholder
    let copyButton = $("#copy");


    // Assuming this page's url is linkspace.com/catalogs/{id}
    copyButton.click(function() {
        // post request to linkspace.com/catalogs/{id}/copy
        $.post(location.pathname + "/copy", function(newCatalogId) {
            // redirect to the new copied catalog: linkspace.com/catalogs/{newCatalogId}
            window.location = "/catalogs/" + newCatalogId;
        })
        .fail(function() {
            alert("Server error");
        });
    });
})