/*
    Main Functions
*/
const bookSearchPage = $("#bookSearch");
bookSearchPage.hide();
let username = "";

function successfulLogin(username) {
  // TODO: lookup user
  $("#user_given_name").text(username); // TODO: Remove hardcode
}

// Authenticates user based on a hash retrieved from a call to google sheets
//(UPDATE FROM SHASH: added function to compare login input to 'user details spreadsheet')
function login() {
  var inputUserName = $("#username").val();
  var retrievedPWHash = "3149054"; //foti // TODO: Retrieve password hash from google sheet with username
  var inputPW = $("#password").val();
  var inputPWHash = hash(inputPW);
  username = inputUserName;
  successfulLogin(username);

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
    const queryURL =
      "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      if (response.length > 0) {
        response.forEach(element => {
          if (element[2] == inputUserName && element[3] == inputPW) {
            $("#username").val("");
            $("#password").val("");
            $("#modal_login").modal("hide");
            successfulLogin(inputUserName);
          } else {
            // TODO: Flesh out error message on page
            console.log("error");
          }
        });
      }
    });
  }
  checkUser(inputUserName, inputPW);
  return true;
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
  var input = $("form#registration_form :input").serialize();
  var userDetails = input;
  console.log(userDetails);
  const URL =
    "https://script.google.com/macros/s/AKfycbz8k7FlnUeb6MjCj7xS6P0boxvrR-kHu4c5MEAD45zY4Li8EZg/exec";

  $.ajax({
    url: URL,
    data: userDetails, //bookID
    method: "POST",
    success: function(data) {
      console.log(data);
    }
  });

  var savedToSheets = true; // should be success of saving function

  if (!savedToSheets) {
    return false;
  }

  $("#reg_firstname").val("");
  $("#reg_surname").val("");
  $("#reg_username").val("");
  $("#reg_password").val("");
  $("#reg_conf_password").val("");
  return true;
}

/*
    Event Handlers
*/

$("#login").click(function() {
  if ($("#username").val() && $("#password").val()) {
    login();
    getWishlist(wishlistID);
    getLibrary(libraryID);
  } else {
    // TODO: Flesh out error message on page
    console.log("error");
  }
});

$("#register").click(function() {
  $("#modal_login").modal("hide");
  $("#modal_register").modal("show");
});

$("#complete").click(function(event) {
  event.preventDefault();
  if (register()) {
    $("#modal_register").modal("hide");
    $("#modal_login").modal("show");
  } else {
    console.log("error");
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

$("#modal_login").modal("show");

//BOOK SEARCH FUNCTIONS//
function bookSearch() {
  // store user input
  var search = document.getElementById("search").value;
  // clear any previous data
  document.getElementById("results").innerHTML = "";

  // make a data request
  $.ajax({
    // url for database
    url: "https://www.googleapis.com/books/v1/volumes?q=" + search,
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
        var newColSm4 = document.createElement("div");
        var newImg = document.createElement("img");
        var newH2 = document.createElement("h2");
        var newH3 = document.createElement("h3");
        var newH4 = document.createElement("h4");
        let newLibrary = document.createElement("button");
        let newWishItem = document.createElement("button");
        //Shash: I've changed 'var' to 'let' for the button elements//

        // add classes to elements
        newColSm4.className = "col-sm-12 col-md-8 col-md-offset-2 item";
        // newLibrary.className = "btn btn-primary";
        // newWishItem.className = "btn btn-primary";

        // add text to tags
        newH2.innerText = jdata.title;
        newLibrary.innerText = "Add to Library";
        newWishItem.innerText = "Add to Wishlist";

        // add attributes (Shash: I've commented out the HREF attributes so the buttons won't change the page)
        // newLibrary.href = jdata.infoLink;
        newLibrary.setAttribute("data", data.items[i].id);
        // newWishItem.href = jdata.infoLink;
        newWishItem.setAttribute("data", data.items[i].id);

        //SHASH: I've added event listeners to the wishlist and library buttons to retreive the 'book ID' (which was set to each button on lines 49 and 51. The book ID will be used to retreive data for the wishlist/library display page//
        //TO DO: link to user login to add user name to spreadsheet when user clicks on button
        newLibrary.addEventListener("click", function addToLibrary() {
          let bookID = newLibrary.getAttribute("data");
          //add book ID to library spreadsheet
          const libURL =
            "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec";

          $.ajax({
            url: libURL,
            data: "Book_ID=" + bookID + "&User=" + username, //TO DO: After we link everything together, need to add USER NAME to data to "post"
            method: "POST",
            success: function(data) {
              console.log(data);
            }
          });
        });

        newWishItem.addEventListener("click", function addToWishlist() {
          let bookID = newWishItem.getAttribute("data");
          //add book ID to wishlist spreadsheet
          const wsURL =
            "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec";

          $.ajax({
            url: wsURL,
            data: "Book_ID=" + bookID + "&User=" + username, //TO DO: Add USER NAME to data after everything is linked
            method: "POST",
            success: function(data) {
              console.log(data);
            }
          });
        });

        // create image if one exists
        if (jdata.imageLinks) {
          newImg.src = jdata.imageLinks.thumbnail;
        } else {
          newImg.src = "img/nobook.jpg";
        }

        // create publish date if one exists
        if (jdata.publishedDate) {
          newH4.innerText = jdata.publishedDate;
        } else {
          newH4.innerText = "no publish date found";
        }

        // create author if one exists
        if (jdata.authors) {
          newH3.innerText = jdata.authors[0];
        } else {
          newH3.innerText = "no author found";
        }

        // add tags to document
        newColSm4.appendChild(newImg);
        newColSm4.appendChild(newH2);
        newColSm4.appendChild(newH3);
        newColSm4.appendChild(newH4);
        newColSm4.appendChild(newLibrary);
        newColSm4.appendChild(newWishItem);

        // add results to the screen
        var results = document.getElementById("results");
        results.appendChild(newColSm4);
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
    method: "GET"
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
    method: "GET"
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
      method: "GET"
    }).then(function(response) {
      let wishlistSection = $("#wishlistItems");
      let bookList = $("<ul>").text(
        response.items[0].volumeInfo.title +
          "-" +
          response.items[0].volumeInfo.authors[0]
      );
      let br = $("<br>");
      let removeBtn = $("<button id='remove'>Remove book?</button>");
      wishlistSection.append(bookList, br, removeBtn);
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
      method: "GET"
    }).then(function(response) {
      let librarySection = $("#libraryItems");
      let libBookList = $("<ul>").text(
        response.items[0].volumeInfo.title +
          "-" +
          response.items[0].volumeInfo.authors[0]
      );
      let br = $("<br>");
      let removeBtn = $("<button id='remove'>Remove book?</button>");
      librarySection.append(libBookList, br, removeBtn);
    });
  }
}
