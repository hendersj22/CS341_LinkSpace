$(document).ready(function () {
    $("#account").click(function () {
        $("#dropdown-menu").toggle();
    });
    $("#dropdown-menu").click(function () {
        $("#dropdown-menu").hide();
    });
    $("#dropdown-menu").mouseleave(function () {
        $("#dropdown-menu").hide();
    });


    $("#trending").click(function() {
        window.location = "/trending";
    });
    $("#home").click(function() {
        window.location = "/";
    });
    $("#mycatalogs").click(function() {
        window.location = "/catalog";
    });
    $("#create").click(function() {
        window.location = "/catalog/create";
    });

    $("#following").click(function() {
        window.location = "/following";
    });

    $("#settings").click(function() {
        window.location = "/settings";
    });

    $.get("/settings/list", function(data) {
        $("#currentUsername").text(data["Name"]);

    });

    $("#logout").click(function() {
        window.location = "/logout";
    })

       //make changes to the HTML to display the search results
function searchEntered(){
    $.post("/search/list", {"Order": "ascending"}, function(data, status){

        for(var i=0; i<data.length; i++){
            var Catalog_ID = data[i]["Catalog_ID"];
            var Catalog_Title = data[i]["Name"];
            var Num_Links = data[i]["Links"].length;
            var Author = data[i]["Author"];
  
          $('#catContainer').append(
              `<div class="grid-item" id=${Catalog_ID}>
                 <div class="catalog">
                   <p class="set-title">${Catalog_Title}</p>
                   <p class="set-link">${Num_Links} links</p>
                   <p class="set-author">${Author}</p>
                 </div>
                 <div class="image"></div><a class="fill-div" href="#"></a>
               </div>`);
        }

        });
}

});