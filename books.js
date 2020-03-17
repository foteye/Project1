//Add data attribute to buttons
//Add event listener, send data.item[i].id to Database
//From list, call Google API with id, display, title, author, image

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
    success: function (data) {
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
        let newLibrary = document.createElement("a");
        let newWishItem = document.createElement("a");
        //Shash: I've changed 'var' to 'let' for the button elements//

        // add classes to elements
        newColSm4.className = "col-sm-12 col-md-8 col-md-offset-2 item";
        newLibrary.className = "btn btn-primary";
        newWishItem.className = "btn btn-primary";

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
          let bookID = newLibrary.getAttribute("data")
          //add book ID to library spreadsheet
          const libURL = "https://script.google.com/macros/s/AKfycbzASd3jjn5fASVi-zQmDu8htgu-OO2Y-H-29d1_ngPwBTJDIez_/exec"

          $.ajax({
            url: libURL,
            data: "Book_ID=" + bookID, //TO DO: After we link everything together, need to add USER NAME to data to "post"
            method: "POST",
            success: function (data) {
              console.log(data)
            }
          })
        })

        newWishItem.addEventListener("click", function addToWishlist() {
          let bookID = newWishItem.getAttribute("data")
          //add book ID to wishlist spreadsheet
          const wsURL = "https://script.google.com/macros/s/AKfycbwVrYRdHSRnb7G0i47eHapATpF9Oq0gK7puMNJw7_QjZOGqIzte/exec"

          $.ajax({
            url: wsURL,
            data: "Book_ID=" + bookID, //TO DO: Add USER NAME to data after everything is linked
            method: "POST",
            success: function (data) {
              console.log(data)
            }
          })
        })

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
