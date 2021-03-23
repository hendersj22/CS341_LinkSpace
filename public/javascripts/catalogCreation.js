/*
* addLinkToHTML()
* onclick method for the add new link section of the create catalog page
* adds new html lines into a div in the original html, creating a new link
* and description entry field
*/
var total_links = 1;

function addLinkToHTML()
{
     
    document.getElementById("link_add").innerHTML += 
        '<p class="catalog_link">Link</p>';
    document.getElementById("link_add").innerHTML +=
        '<div class="catalog_description" id="catalog_link_val'+total_links+'" contenteditable="true">insert link here</div>';
    //removed the below section to reduce clutter
    //document.getElementById("link_add").innerHTML += 
    //    '<p class="catalog_link">Description</p>';
    document.getElementById("link_add").innerHTML += 
        '<div class="catalog_description" id="catalog_description_val'+total_links+'" contenteditable="true">insert description here</div>';
    total_links += 1; //this part sets a unique ID for each links value and description
}

/*
* sendInfoToDatabase()
* function to grab the required information from the page and format
* it into the appropriate structures. Then call a post request, creating
* a new database entry
*/
function sendInfoToDatabase()
{

    var initData = document.getElementById("catalog_link_val").textContent;
    console.log(initData);
    //looping like this reads all of the values except for the inital one, since it does not have a number in the id
    for(i = 1; i < total_links; i++)
    {
        var link_value = "catalog_link_val"+i;
        var data = document.getElementById(link_value.toString()).textContent;
        console.log(data);
    }
    //now what is left is to format the data correctly and to make a post request to save catalog to database
}