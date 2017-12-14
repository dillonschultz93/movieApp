$(document).ready(function(){

  // == GLOBALS ===============================================================

  const MDB_API_KEY = "ffc97c5f0da84d58942394e6f958c2cd";
  let mdbQueryURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MDB_API_KEY}`;

  //== FUNCTIONS ==============================================================

  // a function that creates click events to avoid event delegation
  const modalClickEvents = function() {
    //selector variables
    const modal = $("#modal");
    const modalOverlay = $("#modal-overlay");
    const close = $("#close-btn");
    const open = $(".open-modal");
    // opens the modal
    open.click(function(){
      modal.addClass("modal-open");
      modalOverlay.addClass("overlay-open");
    });
    // closes the modal
    close.click(function(){
      modal.removeClass("modal-open");
      modalOverlay.removeClass("overlay-open");
    });
    // closes modal when clicked outside the modal
    modalOverlay.click(function(){
      modal.removeClass("modal-open");
      modalOverlay.removeClass("overlay-open");
    });
  }

  // a function that dynamically creates the poster matrix
  const renderPosterMatrix = function(image) {
    // variables
    let posterContainer = $('<div class="three columns image-container">');
    let btnContainer = $('<div class="action-buttons">');
    let callToActionBtnWatchList = $('<button class="list-button">ADD TO "WATCHED LIST"</button>');
    let callTOActionBtnAddList = $('<button class="list-button open-modal">ADD TO A LIST</button>');
    let poster = $('<img>')
          .attr('src', image);

    $(".poster-container").prepend(posterContainer);
    posterContainer.append(btnContainer);
    btnContainer.append(callToActionBtnWatchList);
    btnContainer.append(callTOActionBtnAddList);
    btnContainer.after(poster);
  }

  // == MAIN ==================================================================

  // AJAX call that obtains the movies now in theaters
  // from The Movie Database API
  $.ajax({
    url: mdbQueryURL,
    method: "GET"
  }).done(function(response){
    console.log(response);

    // loops through the response...
    response.results.forEach(function(item, index){
      console.log("title: ", response.results[index].title);
      // ...to dynamically make a query URL...
      let queryURL = "https://www.omdbapi.com/?t=" + response.results[index].title + "&y=&plot=short&apikey=dd113167";
      console.log("url: ", queryURL);
      //...and to pass that URL into another AJAX call from the OMDb API
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(answer){
        console.log(answer);
        // save the title and poster image source
        let nowPlaying = {
          title: answer.Title,
  				poster: answer.Poster,
        };
        console.log(nowPlaying);

        // call the poster matrix function and pass the poster item from the
        // nowPlaying object
        renderPosterMatrix(nowPlaying.poster);

        // call the click event function
        modalClickEvents();
      });

    });
  });
});
