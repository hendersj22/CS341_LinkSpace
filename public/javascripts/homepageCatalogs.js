$(document).ready(function(){

    console.log("inside the function");
    
    //post call for updating page of your catalog
    $.post("/catalog/list", {"Order": "ascending"}, function(data, status){//change the /yourcatalog to ref other file

        console.log(data[0]["Catalog_ID"]);

      for(var i=0; i<data.length; i++){
          var Catalog_ID = data[i]["Catalog_ID"];
          var Catalog_Title = data[i]["Name"];
          var Num_Links = data[i]["Links"].length;
          var Author = data[i]["Author"];

        $('#catContainer2').append(
            `<div class="grid-item" id=${Catalog_ID}>
               <div class="catalog">
                 <p class="set-title">${Catalog_Title}</p>
                 <p class="set-link">${Num_Links} links</p>
                 <p class="set-author">${Author}</p>
               </div>
             </div>`);
      }
        catalogClickHandler();
        $("#title2").text("My Catalogs");
    });
    
    $.post("/trending/list", {"Order": "descending"}, function(data, status){

        console.log(data[0]["Catalog_ID"]);

      for(var i=0; i<data.length; i++){
          var Catalog_ID = data[i]["Catalog_ID"];
          var Catalog_Title = data[i]["Name"];
          var Num_Links = data[i]["Links"].length;

        $('#catContainer3').append(
            `<div class="grid-item" id=${Catalog_ID}>
               <div class="catalog">
                 <p class="set-title">${Catalog_Title}</p>
                 <p class="set-link">${Num_Links} links</p>
               </div>
             </div>`);
      }

        catalogClickHandler();
        $("#title3").text("Trending");
      });

})