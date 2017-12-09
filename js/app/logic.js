var movies = ["Super Bad"];

$("#find-movie").on("click", function(event) {

	event.preventDefault();

	var movie = $("#movie-input").val();
	console.log(movie);
	var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=dd113167";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response){
			$("#movie-view").text(JSON.stringify(response));
			console.log(response.Actors);


		})




});