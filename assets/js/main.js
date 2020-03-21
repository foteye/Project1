/*
    Main Functions
*/
const bookSearchPage = $("#bookSearch");
bookSearchPage.hide();
$("#userLists").hide();
$("#heading").hide();

let username = ""; //username global variable to be used when posting data to google spreadsheets

//Login modal:
$("#modal_login").modal("show");

// Authenticates user based on a hash retrieved from a call to google sheets
function login() {
  var inputUserName = $("#username").val();
  var inputPW = $("#password").val();
  var inputPWHash = hash(inputPW);
  username = inputUserName; //update global variable "username"

  checkUser(inputUserName, inputPWHash);
}
//Compare user login details current users
function checkUser(inputUserName, inputPWHash) {
  const queryURL =
    "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var retrievedPWHash = "";
    if (response.length > 0) {
      for (var element of response) {
        if (element[2] == inputUserName) {
          retrievedPWHash = element[3];
          break;
        }
      }
    }
    if (retrievedPWHash == inputPWHash) {
      $("#username").val("");
      $("#password").val("");
      $("#modal_login").modal("hide");
      $("#userLists").show();
      $("#heading").show();
      getWishlist(wishlistID);
      getLibrary(libraryID);
      successfulLogin(username);
    }
    //error alerting user entered details are not in system
    else {
      $("#login_error").modal("show");
    }
  });
}

function register() {
  //Validation goes here, pull out variables
  var firstname = $("#reg_firstname").val();
  var surname = $("#reg_surname").val();
  var username = $("#reg_username").val();
  var password = $("#reg_password").val();
  var passwordHash = hash(password);
  var conf_password = $("#reg_conf_password").val();

  if (password == conf_password) {
    //Update user detail spreadsheet:
    var input =
      "First_Name=" +
      firstname +
      "&Surname=" +
      surname +
      "&Username=" +
      username +
      "&Password=" +
      passwordHash;
    var userDetails = input;
    const URL =
      "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec";

    $.ajax({
      url: URL,
      data: userDetails,
      method: "POST",
      success: function(data) {
        console.log(data);
      }
    });
    $("#reg_firstname").val("");
    $("#reg_surname").val("");
    $("#reg_username").val("");
    $("#reg_password").val("");
    $("#reg_conf_password").val("");
  }
  //Error alerting user passwords not matching
  else {
    $("#error-password_match").modal("show");
    return false;
  }
  return true;
}

//to display username in header:
function successfulLogin(username) {
  $("#user_given_name").text(username);
}

/*
    Event Handlers
*/

$("#searchBtn").click(function() {
  bookSearch();
});

let loginClick = 0;
$("#login").click(function() {
  if ($("#username").val() && $("#password").val()) {
    //Login button can only be clicked once
    if (loginClick == 0) {
      login();
      loginClick = 1;
    }
  }
});

$("#register").click(function() {
  $("#modal_login").modal("hide");
  $("#modal_register").modal("show");  
  
});

// Already registered?
$("#goBack").click(function() {
  $("#modal_login").modal("show");
  $("#modal_register").modal("hide");
});

$("#complete").click(function(event) {
  event.preventDefault();
  if ($("#reg_firstname").val() && $("#reg_surname").val() && $("#reg_username").val() && $("#reg_password").val() && $("#reg_conf_password").val()){
    if (register()) {
      $("#modal_register").modal("hide");
      $("#modal_login").modal("show");
    } else {
      console.log("error");
    }
  } else {
    $("#register_error").show();
  }
});

$("#add_book").click(function() {
  $("#userLists").hide();
  bookSearchPage.show();
});

$("#return").click(function() {
  let wishlistID = [];
  let libraryID = [];
  $("#wishlistItems").empty();
  $("#libraryItems").empty();
  getWishlist(wishlistID);
  getLibrary(libraryID);
  bookSearchPage.hide();
  $("#userLists").show();
});

//clear search history option//
$("#clear").click(function() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("search").value = "";
});

//remove book button
$("#remove").click(function() {});

$("#error-ok").click(function() {
  loginClick = 0;
  $("#username").val("");
  $("#password").val("");
  $("#modal_login").modal("show");
});

$("#pwError-ok").click(function() {
  $("#modal_register").modal("show");
  $("#reg_password").val("");
  $("#reg_conf_password").val("");
});

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
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Posts a book ID to either a wishlist URL or a library URL
function postBookToSheet(url, bookID) {
  $.ajax({
    url: url,
    data: {
      Book_ID: bookID,
      User: username
    },
    method: "POST",
    success: function(data) {
      console.log("Success", data);
    },
    error: function(error) {
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
    data: {
      q: search
    },
    dataType: "json",
    type: "GET",
    // on success, do this
    success: function(data) {
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
        var bookBlurb = $("<p>")
        var buttonDiv = $("<div></div>");
        let addToLibrary = $("<button></button>");
        let addToWishlist = $("<button></button>");

        // add classes to elements
        $(bookContainer).addClass("row book_item");
        $(bookData).addClass("book_data eight wide column");
        $(bookThumb).addClass("three wide column");
        $(buttonDiv).addClass("three wide column");
        $(addToLibrary).addClass("medium ui button book_button");
        $(addToWishlist).addClass("medium ui button book_button");

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
          const url =
            "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec"; // Library Sheet
          const bookID = $(event.target).attr("data");
          $(event.target).addClass("disabled");
          $(event.target).text("Added to Library");
          postBookToSheet(url, bookID);
        });

        $(addToWishlist).click(function() {
          const url =
            "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec"; // Wishlist Sheet
          const bookID = $(event.target).attr("data");
          $(event.target).addClass("disabled");
          $(event.target).text("Added to Wishlist");
          postBookToSheet(url, bookID);
        });

        $(bookThumb).attr('src', (jdata.imageLinks) ? jdata.imageLinks.thumbnail : "./assets/images/nobook.jpg");
        $(bookYear).text((jdata.publishedDate) ? jdata.publishedDate : "Year of Publication Missing");
        $(bookAuthor).text((jdata.authors) ? jdata.authors[0] : "Author Missing");
        $(bookBlurb).text(jdata.description)

        // add tags to document
        bookContainer.append(bookThumb);
        bookData.append(bookTitle);
        bookData.append(bookAuthor);
        bookData.append(bookYear);
        bookData.append(bookBlurb)
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

// add event to element with id="button"
var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", bookSearch, false);

//Add wishlist and library items:
//Store wishlist items specific to user in array
let wishlistID = [];
function getWishlist(wishlistID) {
  const wishlistURL =
    "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec";
  $.ajax({
    url: wishlistURL,
    method: "GET",
    success: function (data){
      console.log(data);
    }, 
    error: function (error){
      console.log(error);
    } 
  }).then(function(wsResponse) {
    if (wsResponse.length > 0) {
      wsResponse.forEach(bookID => {
        if (bookID[1] === username) {
          wishlistID.push(bookID[0]);
        }
      });
      console.log("wishlist=" + wishlistID);
      appendWishlist(wishlistID);
    }
  });
}
//Store library items specific to user in array
let libraryID = [];
function getLibrary(libraryID) {
  const libraryURL =
    "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec";
  $.ajax({
    url: libraryURL,
    method: "GET",
    success: function (data){
      console.log(data);
    }, 
    error: function (error){
      console.log(error);
    }
  }).then(function(libResponse) {
    if (libResponse.length > 0) {
      libResponse.forEach(bookID => {
        if (bookID[1] === username) {
          libraryID.push(bookID[0]);
        }
      });
      console.log("library=" + libraryID);
      appendLibrary(libraryID);
    }
  });
}

//append wishlist items from array to HTML:
function appendWishlist(wishlistID) {
  for (let i = 0; i < wishlistID.length; i++) {
    let url = "https://www.googleapis.com/books/v1/volumes?q=" + wishlistID[i];
    console.log(wishlistID[i]);
    $.ajax({
      url: url,
      method: "GET",
      success: function(data) {
        console.log("Success", data);
      },
      error: function(error) {
        console.log("Error", error);
      }
    }).then(function(response) {
      let wishlistSection = $("#wishlistItems");
      let bookListing = $("<a>").attr("class", "item");
      let listingTitle = $("<h4>")
        .attr("class", "ui medium header")
        .text(response.items[0].volumeInfo.title);
      let listingAuthor = $("<h5>")
        .attr("class", "ui medium")
        .text(response.items[0].volumeInfo.authors);
      let listingBlurb = $("<p>").text(
        response.items[0].volumeInfo.description
      );
      let removeBtn = $(
        "<button id='remove' class='ui button small'>Remove book?</button>"
      );
      wishlistSection.append(bookListing);
      bookListing.append(listingTitle, listingAuthor, listingBlurb, removeBtn);
    });
  }
}

//append library items from array to HTML:
function appendLibrary(libraryID) {
  for (let j = 0; j < libraryID.length; j++) {
    let liburl =
      "https://www.googleapis.com/books/v1/volumes?q=" + libraryID[j];
    $.ajax({
      url: liburl,
      method: "GET",
      success: function(data) {
        console.log("Success", data);
      },
      error: function(error) {
        console.log("Error", error);
      }
    }).then(function(response) {
      let librarySection = $("#libraryItems");
      let bookListing = $("<a>").attr("class", "item");
      let listingTitle = $("<h4>")
        .attr("class", "ui medium header")
        .text(response.items[0].volumeInfo.title);
      let listingAuthor = $("<h5>")
        .attr("class", "ui medium")
        .text(response.items[0].volumeInfo.authors);
      let listingBlurb = $("<p>").text(
        response.items[0].volumeInfo.description
      );
      let removeBtn = $(
        "<button id='remove' class='ui button small'>Remove book?</button>"
      );
      librarySection.append(bookListing);
      bookListing.append(listingTitle, listingAuthor, listingBlurb, removeBtn);
    });
  }
}

// $("#findmatch").click(function () {
//   findMatch()
//   $("#matches").modal('show')
// })

// $("#match-ok").click(function () { $("#matches").modal("hide") })
// //find matches from wishlist:
// let matchedBooks = []
// let matchedUsers = []
// function findMatch() {
//   for (let m = 0; m < wishlistID.length; m++) {
//     function matchLibrary() {
//       const libraryURL =
//         "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec";
//       $.ajax({
//         url: libraryURL,
//         method: "GET"
//       }).then(function (response) {
//         if (response.length > 0) {
//           response.forEach(bookID => {
//             if (bookID[0] === wishlistID[m]) {
//               matchedBooks.push(bookID[0]);
//               matchedUsers.push(bookID[1])
//             }
//           });
//           console.log("matches=" + matchedBooks + "users=" + matchedUsers);
//         }
//       });
//     }
//     matchLibrary()
//     displayMatches()
//   }
// }
// //display matched books: 
// function displayMatches() {
//   for (var b = 0; b < matchedBooks.length; b++) {
//     $("#numberMatches").text(matchedBooks.length)
//     var matchList = $("#listMatches")
//     var matchItem = $("<li>").text(matchedBooks[b] + "-" + matchedUsers)
//     matchList.append(matchItem)
//   }
// }






