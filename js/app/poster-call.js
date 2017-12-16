$(document).ready(function(){

  // == GLOBALS ===============================================================

  const MDB_API_KEY = "ffc97c5f0da84d58942394e6f958c2cd";
  let mdbQueryURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MDB_API_KEY}`;

  //== FUNCTIONS ==============================================================

  // a function that dynamically creates the poster matrix
  const renderPosterMatrix = function(image, id, title) {
    // variables
    let posterContainer = $('<div class="three columns image-container">');
    let btnContainer = $('<div class="action-buttons">');
    let callToActionBtnInfo = $('<button class="list-button">GET INFO</button>').attr("data-movie-id", id);
    callToActionBtnInfo.attr("data-movie-title", title);
    let poster = $('<img>')
        .attr('src', "https://image.tmdb.org/t/p/w500" + image)
        .attr("data-id", id)
        .attr("data-title", title);

    $(".poster-container").prepend(posterContainer);
    posterContainer.append(btnContainer);
    btnContainer.append(callToActionBtnInfo)
                .after(poster);
  }

  // == IN THEATERS VIEW ======================================================

  // AJAX call that obtains the movies now in theaters
  // from The Movie Database API
  $.ajax({
    url: mdbQueryURL,
    method: "GET"
  }).done(function(response){
    console.log(response)
    // loops through the response...
    response.results.forEach(function(item, index){
      let movieTitle = response.results[index].title;
      // ...to dynamically make a query URL...
      // let queryURL = "https://www.omdbapi.com/?t=" + response.results[index].title + "&y=&plot=short&apikey=dd113167";
      let queryURL = `https://api.themoviedb.org/3/movie/${response.results[index].id}/images?api_key=${MDB_API_KEY}&language=en`
      //...and to pass that URL into another AJAX call from the OMDb API
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(answer){
        // save the title and poster image source
        let nowPlaying = {
          id: answer.id,
  				poster: answer.posters[0].file_path,
          title: movieTitle
        };
        console.log(nowPlaying);

        // call the poster matrix function and pass the poster item from the
        // nowPlaying object
        renderPosterMatrix(nowPlaying.poster, nowPlaying.id, nowPlaying.title);
      });

    });
  });

  // == SEARCH VIEW ===========================================================

  // == MOVIE DETAILS VIEW ====================================================
});
