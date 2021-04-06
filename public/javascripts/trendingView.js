$(document).ready(function(){

    //post call for showing lists of the trending page
    //How it works: currently it is only accessing recent catalogs once a catalog rater has been established code can be changed
    //work with that.
    $.post("/trending/list", {"order": "descending"}, function(data, status){

        console.log(data[0]["Catalog_ID"]);

      for(var i=0; i<data.length; i++){
          var Catalog_ID = data[i]["Catalog_ID"];
          var Catalog_Title = data[i]["Name"];
          var Num_Links = data[i]["Links"].length;

        $('#catContainer').append(
            `<div class="grid-item" id=${Catalog_ID}>
               <div class="catalog">
                 <p class="set-title">${Catalog_Title}</p>
                 <p class="set-link">${Num_Links} links</p>
               </div>
               <div class="image"></div><a class="fill-div" href="#"></a>
             </div>`);
      }

      });

      catalogClickHandler();
      $("#trend").text("My Catalogs");
})  