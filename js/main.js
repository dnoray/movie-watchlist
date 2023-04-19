const baseURL = "http://www.omdbapi.com/?apikey=be8783a4&";
const searchBtn = document.getElementById("search-btn");
let searchText = document.getElementById("search-txt");
const movieList = document.getElementById("movie-list");
const errMsg = `<p class="bg-txt">Unable to find what you're looking for. Please try another search.</p>`
let movieListHtml = ''

        
// search button on click
searchBtn.addEventListener("click", async () => {
    const searchTerm = searchText.value;
    const res = await fetch(`${baseURL}s=${searchTerm}&type=movie`)
    const data = await res.json()
    // Iterate thru each movie returned for it's imdbID
    if (data.Response === 'True') {
        data.Search.forEach(async movie => {
            const movidId = movie.imdbID
            // Fetch the details of each movie
            const res = await fetch(`${baseURL}i=${movidId}`)
            const data = await res.json()
            // Retrieve the needed info from each movie
            const {Poster, Title, imdbRating, Runtime, Genre, Plot} = data
            // Create Html for each movie
            movieListHtml += 
            `<div class="movie">
                <img class="movie-poster" src="${Poster}" alt="Movie Poster">
                <div class="movie-info">
                    <p class="movie-title">${Title}</p><span class="movie-rating"><span class="fa fa-star"></span> ${imdbRating}</span>
                    <div class="movie-specs">
                        <div class="movie-duration">${Runtime}</div>
                        <div class="movie-genre">${Genre}</div>
                        <div class="watch-list-btn">Watchlist</div>
                    </div>
                <p class="movie-plot">${Plot}</p>
                </div>
            </div>
            `
            // Present the user with the request movie/movies
            movieList.innerHTML = movieListHtml
        })
    } else {
        // If no data is returned, info the user
        searchText.value = `Searching something with no data`
        movieList.innerHTML = errMsg
    } 
})
