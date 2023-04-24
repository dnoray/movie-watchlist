const baseURL = "http://www.omdbapi.com/?apikey=be8783a4&";
const searchBtn = document.getElementById("search-btn");
let searchText = document.getElementById("search-txt");
const movieList = document.getElementById("movie-list");
const errMsg = `<p class="bg-txt">Unable to find what you're looking for. Please try another search.</p>`
const errMsg2 = `<p class="bg-txt">Your watchlist is looking a little empty...</p>
                 <p class="link-text"><a href="index.html"><img src="/images/Icon+.png" atl="plus icon"></a>Let's add some movies!</p>`
let movieListHtml = ''
let watchListHtml = ''

async function getMovies(searchTxt) {
    const res = await fetch(`${baseURL}s=${searchTxt}&type=movie`)
    const data = await res.json()
    // If data call showMovies
    if (data.Response == 'True') {
        showMovies(data.Search)
    } else {
        // If no data is returned, inform the user
        searchText.value = `Searching something with no data`
        movieList.innerHTML = errMsg
    }
}

function showMovies(data) {
    // Iterate thru each movie returned for it's imdbID
    data.forEach(async movie => {
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
                    <div onclick="addMovieId('${movidId}')"; return false;" class="watch-list-btn"><img src="/images/Icon+.png" alt="icon">Watchlist</div>
                </div>
                <p class="movie-plot">${Plot}</p>
            </div>
        </div>
        `
        // Present the user with the request movie/movies
        movieList.innerHTML = movieListHtml
    })
    movieListHtml = ''
}
        
// search button on click
searchBtn.addEventListener("click", () => {
    const searchTerm = searchText.value;
    getMovies(searchTerm)
})

let watchListArr = localStorage.getItem('moviesId') ? 
JSON.parse(localStorage.getItem('moviesId')) : [];

function addMovieId(id) {
    watchListArr.push(id);
    localStorage.setItem('moviesId', JSON.stringify(watchListArr));
}

function removeMovieId(id) {
    let watchList = JSON.parse(localStorage.getItem('moviesId'))
    const newWatchList = watchList.filter(arrId => arrId !== id)
    localStorage.setItem('moviesId', JSON.stringify(newWatchList))
    watchList = JSON.parse(localStorage.getItem('moviesId'))
    
    if (watchList.length == 0) {
        document.getElementById('saved-videos').innerHTML = errMsg2
    } else {
        watchList.forEach(async id => {
            const res = await fetch(`${baseURL}i=${id}`)
            const data = await res.json()
            console.log(data)
            const {Poster, Title, imdbRating, Runtime, Genre, Plot} = data
            watchListHtml +=
            `<div class="movie">
            <img class="movie-poster" src="${Poster}" alt="Movie Poster">
            <div class="movie-info">
                <p class="movie-title">${Title}</p><span class="movie-rating"><span class="fa fa-star"></span> ${imdbRating}</span>
                <div class="movie-specs">
                    <div class="movie-duration">${Runtime}</div>
                    <div class="movie-genre">${Genre}</div>
                    <div onclick="removeMovieId('${id}')"; return false;" class="watch-list-btn"><img src="/images/Icon-.png" alt="icon">Watchlist</div>
                </div>
                <p class="movie-plot">${Plot}</p>
            </div>
        </div>
        `
        document.getElementById('saved-videos').innerHTML = watchListHtml
        })
        watchListHtml = ''
    }
}

function displayWatchList() {
    const watchList = JSON.parse(localStorage.getItem('moviesId'))
    if (!watchList || watchList.length == 0) {
        document.getElementById('saved-videos').innerHTML = errMsg2
    } else {
        watchList.forEach(async id => {
            const res = await fetch(`${baseURL}i=${id}`)
            const data = await res.json()
            console.log(data)
            const {Poster, Title, imdbRating, Runtime, Genre, Plot} = data
            watchListHtml +=
            `<div class="movie">
            <img class="movie-poster" src="${Poster}" alt="Movie Poster">
            <div class="movie-info">
                <p class="movie-title">${Title}</p><span class="movie-rating"><span class="fa fa-star"></span> ${imdbRating}</span>
                <div class="movie-specs">
                    <div class="movie-duration">${Runtime}</div>
                    <div class="movie-genre">${Genre}</div>
                    <div onclick="removeMovieId('${id}')"; return false;" class="watch-list-btn"><img src="/images/Icon-.png" alt="icon">Watchlist</div>
                </div>
                <p class="movie-plot">${Plot}</p>
            </div>
        </div>
        `
        document.getElementById('saved-videos').innerHTML = watchListHtml
        })
    }
    watchListHtml = ''
}
