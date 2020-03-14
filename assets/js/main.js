/*
    Main Functions
*/

function successfulLogin(username){
    // TODO: lookup user
    $("#user_given_name").text('Foti'); // TODO: Remove hardcode

}

// Authenticates user based on a hash retrieved from a call to google sheets
function login(){
    var inputUserName = $("#username").val();
    var retrievedPWHash = '3149054'; //foti // TODO: Retrieve password hash from google sheet with username
    var inputPW = $("#password").val();
    var inputPWHash = hash(inputPW);

    if (inputPWHash == retrievedPWHash){
        $("#username").val('');
        $("#password").val('');
        $('#modal_login').modal('hide');
        successfulLogin(inputUserName);
    } else {
        // TODO: Flesh out error message on page
        console.log("error");
    }
}

// TODO: Shash validate and save the login details to sheet
function register(){

    //Validation goes here, pull out variables
    var firstname = $("#reg_firstname").val();
    var surname = $("#reg_surname").val();
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    var conf_password = $("#reg_conf_password").val();

    var savedToSheets = true; // should be success of saving function

    if (!savedToSheets){
        return false;
    }
    
    $("#reg_firstname").val('');
    $("#reg_surname").val('');
    $("#reg_username").val('');
    $("#reg_password").val('');
    $("#reg_conf_password").val('');
    return true;

}

/*
    Event Handlers
*/ 

$("#login").click(function(){
    if ($("#username").val() && $("#password").val()){
        login();
    } else {
        // TODO: Flesh out error message on page
        console.log('error');
    }
});

$("#register").click(function(){
    $('#modal_login').modal('hide');
    $('#modal_register').modal('show');
});

$("#complete").click(function(){
    if (register()){
        $('#modal_register').modal('hide');
        $('#modal_login').modal('show');
    } else {
        console.log('error');
    }
});

/*
    Util Functions
*/ 

//Returns a hash of a given string
function hash(string){
    var hash = 0;
    if (string.length == 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

$('#modal_login').modal('show');
