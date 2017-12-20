// == GLOBALS ===============================================================
let movieSearch
const MDB_API_KEY = "ffc97c5f0da84d58942394e6f958c2cd";
let mdbQueryURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${MDB_API_KEY}`;

//== FUNCTIONS ==============================================================

// a function that dynamically creates the poster matrix
const renderPosterMatrix = function (image, id, title) {
  // variables
  let posterContainer = $('<div class="three columns image-container">');
  let btnContainer = $('<div class="action-buttons">');
  let callToActionBtnInfo = $('<button class="list-button">GET INFO</button>').attr("data-movie-id", id);
  callToActionBtnInfo.attr("data-movie-title", title);
  callToActionBtnInfo.attr("data-src-url", image);
  let poster = $('<img>')
    .attr('src', "https://image.tmdb.org/t/p/w500" + image)
    .attr("data-id", id)
    .attr("data-title", title)
    .attr("data-src-url", image);

  $(".poster-container").prepend(posterContainer);
  posterContainer.append(btnContainer);
  btnContainer.append(callToActionBtnInfo)
    .after(poster);
}

// AJAX call that obtains the movies now in theaters
// from The Movie Database API
const posterCall = function () {
  movieSearch = ""
  $.ajax({
    url: mdbQueryURL,
    method: "GET"
  }).done(function (response) {
    console.log(response);
    // loops through the response...
    response.results.forEach(function (item, index) {
      let movieTitle = response.results[index].title;
      // ...to dynamically make a query URL...
      let queryURL = `https://api.themoviedb.org/3/movie/${response.results[index].id}/images?api_key=${MDB_API_KEY}&language=en`
      //...and to pass that URL into another AJAX call
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function (answer) {
        // save the title and poster image source
        let nowPlaying = {
          id: answer.id,
          poster: answer.posters[0].file_path,
          title: movieTitle
        };

        // call the poster matrix function and pass the poster item from the
        // nowPlaying object
        renderPosterMatrix(nowPlaying.poster, nowPlaying.id, nowPlaying.title);
      });
    });
  });
}
const clearQueryResults = function () {
  $(".subheading").text("Search results for: " + movieSearch)
  $(".poster-container").empty()
}

const movieSearchQueryResults = function (movie) {
  $.ajax({
    url: mdbSearchURL,
    method: "GET"
  }).done(function (response) {
    // loops through the response...
    response.results.forEach(function (item, index) {
      let movieTitle = response.results[index].title;
      // ...to dynamically make a query URL...
      let queryURL = `https://api.themoviedb.org/3/movie/${response.results[index].id}/images?api_key=${MDB_API_KEY}&language=en`
      //...and to pass that URL into another AJAX call from the OMDb API
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function (answer) {
        // save the title and poster image source
        let nowPlaying = {
          id: answer.id,
          poster: answer.posters[0].file_path,
          // PREVENT ERRORS FROM DISPLAYING
          // PROBLEM: RENDERS BLANKS IN POSTER MATRIX -- LEAVES HOLES IN PAGE
          // poster: answer.posters[0] && answer.posters[0].file_path,
          title: movieTitle
        };
        // call the poster matrix function and pass the poster item from the
        // nowPlaying object
        renderPosterMatrix(nowPlaying.poster, nowPlaying.id, nowPlaying.title);
      });
    });
  })
}

// == IN THEATERS VIEW ======================================================

posterCall();

// == SEARCH VIEW ===========================================================

$(document).keypress(function (e) {
  var keycode = (e.keyCode ? e.keyCode : e.which);
  if (keycode == '13') {
    movieSearch = $("#search").val()
    clearQueryResults()
    $("#search").val("")
    mdbSearchURL = `https://api.themoviedb.org/3/search/movie?api_key=${MDB_API_KEY}&language=en-US&query=${movieSearch}&page=1&include_adult=false`
    movieSearchQueryResults()
  }
});


// == MOVIE DETAILS VIEW ====================================================

// a click event function that runs an OMDb API call
$(".poster-container").on("click", ".list-button", function () {
  const API_KEY = "dd113167";
  let input = $(this).data("movie-title");
  let posterSource = $(this).data("src-url");
  let URL = `https://www.omdbapi.com/?t=${input}&apikey=${API_KEY}`
  $.ajax({
    url: URL,
    method: "GET"
  }).done(function (response) {
    console.log(response);
    let movieObject = {
      title: response.Title,
      year: response.Year,
      rating: response.Rated,
      director: response.Director,
      writer: response.Writer,
      cast: response.Actors,
      plot: response.Plot,
      genre: response.Genre,
    }
    // if (response.Ratings[0]) {
      movieObject.rating1 = response.Ratings[0]
    // }
    // if (response.Ratings[1]) {
      movieObject.rating2 = response.Ratings[1]
    // }
    // if (response.Ratings[2]) {
      movieObject.rating3 = response.Ratings[2]
    // }
    //AJAX call for UTelly - Streaming services
    $.ajax({
      type: "GET",
      url: `https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?country=us&term=${input}`,
      dataType: 'json',
      error: function (err) { alert("Internet Disconnected!"); },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", "BuX3pzEQ9pmshrgta6yT0czx5wIkp1Uc40cjsncFSh7Oq1WsAn");
      }
    }).done(function (response) {
      console.log(response)
      if (response.results.length === 0) {
        $(".not-available").text("Not yet available for streaming.")
      }
      else {
        response.results.forEach(function (item, index) {
          if (item.name === input) {
            item.locations.forEach(function (element, index) {
              let streamSiteTitle = item.locations[index].display_name
              let streamSiteuRL = item.locations[index].url
              let streamSiteIcon = item.locations[index].icon
              $('<img />').attr({
                src: streamSiteIcon,
              }).appendTo($('<a />').attr({
                href: streamSiteuRL,
                target: "_blank"
              }).appendTo($('#where-to-watch')));
              $('<br>').appendTo('#where-to-watch')
            })
          }
        })
      }
    })
    // empties out the poster container and dynamically fills in HTML based on
    // the button clicked
    $(".poster-container").empty();
    $("#subheading").empty();
    // variables that store query selectors
    let movieInfo = $('<div id="movie-details">');
    let poster = $('<img class="no-hover">')
      .attr("src", "https://image.tmdb.org/t/p/w500" + posterSource);
    let posterColumn = $('<div class="three columns image-container" id="poster">')
      .append(poster);
    let synopsis = $('<div class="six columns synop">')
      .append('<p class="info" id="year"></p>')
      .append('<p class="info">Rating: <span id="rating"></span></p>')
      .append('<p class="basic-para" id="plot"></p>');
    let ratingSection = $('<div class="three columns rating" id="rating-section">')
      .prepend('<h5 class="section-heading">Rating</h5>')
      // .append('<p class="info">Rotten Tomatoes: <span id="rotten-tomatoes"></span></p>');
      .append('<p class="info"><span id="rating1"></span><span id="rating1-val"></span></p>')
      .append('<p class="info"><span id="rating2"></span><span id="rating2-val"></span></p>')
      .append('<p class="info"><span id="rating3"></span><span id="rating3-val"></span></p>');
    let streamingSection = $('<div class="three columns" id="where-to-watch">')
      .append('<h5 class="section-heading">Where to watch</h5>')
      //NEEDS TO BE STYLED -- PLACEHOLDER CLASS
      .append('<h4 class="not-available"></h4>');
    let navComponents = $('<ul class="nav-components">')
      .append('<li class="nav-item"><button class="detail-btn" id="cast">Cast</button></li>')
      .append('<li class="nav-item"><button class="detail-btn" id="crew">Crew</button></li>')
      .append('<li class="nav-item"><button class="detail-btn" id="genre">Genre</button></li>');
    let detailNav = $('<div class="detail-nav">')
      .append(navComponents);
    let movieDetails = $('<div class="six columns cast-crew-details">')
      .append(detailNav);
    let info = $('<div class="info-details">')
    let actors = $('<p class="basic-para">Cast: <span id="actors"><span></p>');
    let director = $('<p class="basic-para">Director: <span id="director"><span></p>');
    let writer = $('<p class="basic-para">Writer: <span id="writer"><span></p>');
    let genre = $('<p class="basic-para">Genre(s): <span id="genres"><span></p>');
    let returnButton = $('<button class="u-full-width" id="go-back">Go Back</button>');
    let returnSection = $('<div class="three columns" id="back-btn">')
      .append(returnButton);


    //DOM Manipulation
    $("#subheading").text(movieObject.title);
    $(".poster-container").append(movieInfo);
    $(movieInfo).prepend(posterColumn);
    $(movieInfo).append(synopsis);
    $("#year").text(movieObject.year);
    $("#rating").text(movieObject.rating);
    $("#plot").text(movieObject.plot);
    $(movieInfo).append(ratingSection);
    if (movieObject.rating1) {
      $("#rating1").text(movieObject.rating1.Source + ": ");
      $("#rating1-val").text(movieObject.rating1.Value);
    }
    if (movieObject.rating2) {
      $("#rating2").text(movieObject.rating2.Source + ": ");
      $("#rating2-val").text(movieObject.rating2.Value);
    }
    if (movieObject.rating3) {
      $("#rating3").text(movieObject.rating3.Source + ": ");
      $("#rating3-val").text(movieObject.rating3.Value);
    }
    $(movieInfo).append(streamingSection);
    $(movieInfo).append(movieDetails);
    $(movieInfo).append(returnSection);

    // Click events for the detail nav
    $('.poster-container').on("click", "#cast", function () {
      info.empty();
      detailNav.after(info);
      info.append(actors);
      $("#actors").text(movieObject.cast);
    });

    $('.poster-container').on("click", "#crew", function () {
      info.empty();
      detailNav.after(info);
      info.append(director);
      $("#director").text(movieObject.director);
      info.append(writer);
      $("#writer").text(movieObject.writer);
    });

    $('.poster-container').on("click", "#genre", function () {
      info.empty();
      detailNav.after(info);
      info.append(genre);
      $("#genres").text(movieObject.genre);
    });

  });

});

// Click event for the return button
$('.poster-container').on("click", "#go-back", function () {
  $('.poster-container').empty();
  if (movieSearch){
    clearQueryResults()
    movieSearchQueryResults()
  }
  else {
    posterCall();
    $('.subheading').text("In Theaters Now");
  }
});

$('.jumbo-btn').on("click", function () {
  $(".poster-container").empty()
  posterCall()
  $('.subheading').text("In Theaters Now");

})
