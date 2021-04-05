// Author: Grant Nelson and Miggy Sabater
// Updated: 3/31/2021
// Functionality of page for your order catalogs



//Function for Your Catalog Page
$(document).ready(function(){
    //post call for updating page of your catalog
    $.post("/catalog/list", {"Order": "ascending"}, function(data, status){//change the /yourcatalog to ref other file

        console.log(data[0]["Catalog_ID"]);

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
               <!--<div class="image"></div><a class="fill-div" href="#"></a>-->
             </div>`);

      }
      catalogClickHandler();
      $("#trend").text("My Catalogs");




    // for(var i=0; i<3; i++){
    //     var ID = "Catalog_ID" + i;
    //     var Catalog_Name = data[i].name;
    //     var Catlog_Link = data[i].link;

    //     console.log("inside the function");
    
    //     converted = JSON.stringify(Catalog_Name + " " + Catalog_Link);

        
    
    //     parse = JSON.parse(converted);
    
    //       document.getElementById(ID).innerHTML = parse;
    //     }
      });
})  