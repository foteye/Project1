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
        var newAnchor = document.createElement("a");

        // add classes to elements
        newColSm4.className = "col-sm-12 col-md-8 col-md-offset-2 item";
        newAnchor.className = "btn btn-primary";

        // add text to tags
        newH2.innerText = jdata.title;
        newAnchor.innerText = "Add to Library";

        // add attributes
        newAnchor.href = jdata.infoLink;
        newAnchor.setAttribute("target", "_blank");

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
        newColSm4.appendChild(newAnchor);

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
