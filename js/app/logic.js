
function ajaxCall(cb) {
	var movie = "The Matrix"
	// var movie = $("#movie-input").val();
	var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=dd113167";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			var movieObject = {
				title : response.Title,
				director : response.Director,
				genre : response.Genre,
				plot : response.Plot,
				poster : response.Poster,
				rated : response.Rated,
				imdbRatings : response.Ratings[0].Value,
				rtRatings : response.Ratings[1].Value,
				mcRatings : response.Ratings[2].Value,
				released : response.Released,
				writer : response.Writer,
				year : response.Year
			}
			cb(movieObject)
			console.log(movieObject);
		})

};


myArray = []

ajaxCall(function (movie) {
	myArray.push(movie)
})
