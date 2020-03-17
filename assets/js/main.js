/*
    Main Functions
*/
const bookSearchPage = $("#bookSearch")
bookSearchPage.hide()
let username = ""
$('#modal_login').modal('show');


function successfulLogin(username) {
    // TODO: lookup user
    $("#user_given_name").text(username); // TODO: Remove hardcode

}

// Authenticates user based on a hash retrieved from a call to google sheets
//(UPDATE FROM SHASH: added function to compare login input to 'user details spreadsheet')
function login() {
    var inputUserName = $("#username").val();
    var retrievedPWHash = '3149054'; //foti // TODO: Retrieve password hash from google sheet with username
    var inputPW = $("#password").val();
    var inputPWHash = hash(inputPW);
    username = inputUserName
    successfulLogin(username)


    // if (inputPWHash == retrievedPWHash) {
    //     $("#username").val('');
    //     $("#password").val('');
    //     $('#modal_login').modal('hide');
    //     successfulLogin(inputUserName);
    // } else {
    //     // TODO: Flesh out error message on page
    //     console.log("error");
    // }

    //Compare user login details current users
    function checkUser(inputUserName, inputPW) {
        const queryURL = "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if (response.length > 0) {
                response.forEach(element => {
                    if (element[2] == inputUserName && element[3] == inputPW) {
                        $("#username").val('');
                        $("#password").val('');
                        $('#modal_login').modal('hide');
                        successfulLogin(inputUserName);
                    }
                    else {
                        // TODO: Flesh out error message on page
                        console.log("error");
                    }
                });

            }
        })
    }
    checkUser(inputUserName, inputPW)
    return true


}

// TODO: Shash validate and save the login details to sheet (UPDATE FROM SHASH: I have added function to post data to spreadsheet)
function register() {

    //Validation goes here, pull out variables
    // var firstname = $("#reg_firstname").val();
    // var surname = $("#reg_surname").val();
    // var username = $("#reg_username").val();
    // var password = $("#reg_password").val();
    // var conf_password = $("#reg_conf_password").val();

    //Update user detail spreadsheet:
    var input = $('form#registration_form :input').serialize()
    var userDetails = input
    console.log(userDetails)
    const URL = "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec"

    $.ajax({
        url: URL,
        data: userDetails,//bookID
        method: "POST",
        success: function (data) {
            console.log(data)
        }
    })

    var savedToSheets = true; // should be success of saving function

    if (!savedToSheets) {
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

$("#searchBtn").click(function(){
    bookSearch();
});

$("#login").click(function () {
    if ($("#username").val() && $("#password").val()) {
        login();
        getWishlist(wishlistID);
        getLibrary(libraryID)
    } else {
        // TODO: Flesh out error message on page
        console.log('error');
    }
});

$("#register").click(function () {
    $('#modal_login').modal('hide');
    $('#modal_register').modal('show');
});

$("#complete").click(function (event) {
    event.preventDefault()
    if (register()) {
        $('#modal_register').modal('hide');
        $('#modal_login').modal('show');
    } else {
        console.log('error');
    }
});

$("#add_book").click(function () {
    $("#userLists").hide()
    bookSearchPage.show()
})

$("#return").click(function () {
    let wishlistID = []
    let libraryID = []
    $("#wishlistItems").empty()
    $("#libraryItems").empty()
    getWishlist(wishlistID)
    getLibrary(libraryID)
    bookSearchPage.hide()
    $("#userLists").show()
})

/*
    Util Functions
*/

//Returns a hash of a given string
function hash(string) {
    var hash = 0;
    if (string.length == 0) {
        return hash;
    }
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// Posts a book ID to either a wishlist URL or a library URL
function postBookToSheet(url, bookID){
    $.ajax({
        url: url,
        data: {
            "Book_ID" : bookID, 
            "User" : username
        },
        method: "POST",
        success: function (data) {
            console.log("Success", data);
        },
        error: function(error){
            console.log("Error:", error);
        }
    });
}

//BOOK SEARCH FUNCTIONS//
function bookSearch() {
    var search = $("#search").val();
    $("#results").empty();

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes",
        data : {
            q : search
        },
        dataType: "json",
        type: "GET",
        // on success, do this
        success: function (data) {
            // display data being passed through
            console.log(data);

            // loop through data in data.items
            for (var i = 0; i < data.items.length; i++) {
                // store current books volume info
                var jdata = data.items[i].volumeInfo;

                // create elements
                var bookContainer = $("<div></div>");
                var bookThumb = $("<img></img>");
                var bookData = $("<div></div>");
                var bookTitle = $("<h2></h2>");
                var bookAuthor = $("<h3></h3>");
                var bookYear = $("<h4></h4>");
                var buttonDiv = $("<div></div>");
                let addToLibrary = $("<button></button>");
                let addToWishlist = $("<button></button>");
                
                // add classes to elements
                $(bookContainer).addClass("row book_item");
                $(bookData).addClass("book_data eight wide column");
                $(bookThumb).addClass("three wide column");
                $(buttonDiv).addClass("three wide column");
                $(addToLibrary).addClass('medium ui button book_button');
                $(addToWishlist).addClass('medium ui button book_button');

                // add text to tags
                $(bookTitle).text(jdata.title);
                $(addToLibrary).text("Add to Library");
                $(addToWishlist).text("Add to Wishlist");

                // add href and data
                $(addToLibrary).attr("href", jdata.infoLink);
                $(addToLibrary).attr("data", data.items[i].id);
                $(addToWishlist).attr("href", jdata.infoLink);
                $(addToWishlist).attr("data", data.items[i].id);

                $(addToLibrary).click(function() {
                    const url = "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec"; // Library Sheet
                    const bookID = $(event.target).data();
                    postBookToSheet(url, bookID);
                });

                $(addToLibrary).click(function() {
                    const url = "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec"; //
                    const bookID = $(event.target).data();
                    postBookToSheet(url, bookID);
                });


                $(bookThumb).attr('src', (jdata.imageLinks) ? jdata.imageLinks.thumbnail : "./assets/img/nobook.jpg");
                $(bookYear).text((jdata.publishedDate) ? jdata.publishedDate : "Year of Publication Missing");
                $(bookAuthor).text((jdata.authors) ? jdata.authors[0] : "Author Missing");

                // add tags to document
                bookContainer.append(bookThumb);
                bookData.append(bookTitle);
                bookData.append(bookAuthor);
                bookData.append(bookYear);
                bookContainer.append(bookData);
                buttonDiv.append(addToLibrary);
                buttonDiv.append(addToWishlist);
                bookContainer.append(buttonDiv);

                // add results to the screen
                $("#results").append(bookContainer);
            }
        }
    });
}


//Add wishlist and library items:
//Store wishlist items specific to user in array
let wishlistID = []
function getWishlist(wishlistID) {
    const wishlistURL = "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec"
    $.ajax({
        url: wishlistURL,
        method: "GET"
    }).then(function (wsResponse) {
        if (wsResponse.length > 0) {
            wsResponse.forEach(bookID => {

                if (bookID[1] === username) {
                    wishlistID.push(bookID[0])
                }
            });
            console.log("wishlist=" + wishlistID)
            appendWishlist(wishlistID)
        }
    })
}
//Store library items specific to user in array
let libraryID = []
function getLibrary(libraryID) {
    const libraryURL = "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec"
    $.ajax({
        url: libraryURL,
        method: "GET"
    }).then(function (libResponse) {
        if (libResponse.length > 0) {
            libResponse.forEach(bookID => {

                if (bookID[1] === username) {
                    libraryID.push(bookID[0])
                }
            });
            console.log("library=" + libraryID)
            appendLibrary(libraryID)
        }
    })
}

//append wishlist items from array to HTML:
function appendWishlist(wishlistID) {
    for (let i = 0; i < wishlistID.length; i++) {
        let url = "https://www.googleapis.com/books/v1/volumes?q=" + wishlistID[i]
        console.log(wishlistID[i])
        $.ajax({
            url: url,
            method: "GET",
            success: function(data){
                console.log("Success", data);
            },
            error: function(error){
                console.log("Error", error);
            }
        }).then(function (response) {
            let wishlistSection = $("#wishlistItems")
            let bookList = $("<ul>").text(response.items[0].volumeInfo.title + "-" + response.items[0].volumeInfo.authors[0])
            let br = $("<br>")
            wishlistSection.append(bookList, br)
        })
    }
}

//append library items from array to HTML:
function appendLibrary(libraryID) {
    for (let j = 0; j < libraryID.length; j++) {
        let liburl = "https://www.googleapis.com/books/v1/volumes?q=" + libraryID[j]
        $.ajax({
            url: liburl,
            method: "GET",
            success: function(data){
                console.log("Success", data);
            },
            error: function(error){
                console.log("Error", error);
            }
        }).then(function (response) {
            let librarySection = $("#libraryItems")
            let libBookList = $("<ul>").text(response.items[0].volumeInfo.title + "-" + response.items[0].volumeInfo.authors[0]);
            let br = $("<br>")
            librarySection.append(libBookList, br)
        })
    }
}
