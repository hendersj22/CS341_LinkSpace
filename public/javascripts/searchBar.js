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

});