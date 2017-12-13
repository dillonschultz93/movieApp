var movies = ["Super Bad"];
var moviesToWatch = [];

$("#find-movie").on("click", function(event) {

	event.preventDefault();

	var movie = $("#movie-input").val();
	var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=dd113167";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			$("#movie-view").text(JSON.stringify(response));
			console.log(response);
			console.log(response.Title);
			console.log(response.Released);
			console.log(response.Rated);
			console.log(response.Runtime);
			console.log(response.Plot);
			console.log(response.Poster);
		})

});