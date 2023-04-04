const searchInput = document.getElementById('search-input');
const searchList = document.getElementById('search-list');
const container = document.getElementById('container');
const favouriteBtn = document.getElementById('favourite-btn');

// empty string
let html = '';

// empty array
let favouriteMovieArray = [];

async function loadMovies(searchTerm) {
  await fetch(`http://www.omdbapi.com/?t=${searchTerm}&page=1&apikey=822ca33b`)
    .then((res) => res.json())
    .then((data) => {
      displayMovieList(data);
    });
}

function findMovies() {
  let searchTerm = searchInput.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

function displayMovieList(movie) {
  searchList.innerHTML = '';
  let movieListItem = movie.imdbID;

  if (movie.Poster != 'N/A') {
    moviePoster = movie.Poster;
  } else {
    moviePoster = './photos/image_not_found.png';
  }

  if (movie.Response != 'False') {
    html += `
        <div class="search-list-item" id="${movieListItem}">
            <div class="search-item-thumbnail">
                <img src="${moviePoster}" alt="Poster of ${movie.Title}">
            </div>
            <div class="search-item-info">
                <div>
                    <h4>${movie.Title}</h4>
                    <p>${movie.Year}</p>
                    <p>${movie.Actors}</p>
                </div>
            </div>
        </div>
        `;
  }

  // rendering the list
  searchList.innerHTML = html;
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      // Hides the search list
      searchList.classList.add('hide-search-list');

      // empty the search box
      searchInput.value = '';

      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.id}&page=1&apikey=822ca33b`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  container.innerHTML = '';
  container.innerHTML = `
  <section class="container" id="container">
    <h3 class="movie-title">${details.Title}</h3>
    <div class="movie-header">
      <div class="runtime">
        <p>${details.Year}</p>
        <p>${details.Runtime}</p>
      </div>
      <div class="star-rating movie-star-rating">
        <p class="imdb-rating">
          <i class="fa-solid fa-star"></i>
          ${details.imdbRating}
        </p>
        <p class="add-favourite-btn" id="add-favourite-btn">
            Add to your favourites<i class="fa-regular fa-star movie-page-star"></i>
        </p>
      </div>

      <!-- movie section -->
      <div class="movie-container">
        <div>
            <img src="${
              details.Poster != 'N/A'
                ? details.Poster
                : './photos/image_not_found.png'
            }" alt="movie poster" >
        </div>
        <div class="detailed-summary">
          <p>Genre: <span class="highlight">${details.Genre}</span></p>
          <p>Summary: <span class="highlight">${details.Plot}</span></p> 
          <p>Director <span class="highlight">${details.Director}</span></p>
          <p>Writers <span class="highlight">${details.Writer}</span></p>
          <p>Stars <span class="highlight">${details.Actors}</span></p>
        </div>
      </div>
    </div>
  </section>`;
  loadFavourites(details);
}

function loadFavourites(movie) {
  document
    .getElementById('add-favourite-btn')
    .addEventListener('click', function () {
      favouriteMovieArray.push(movie);
      // pushing the favourite movies in the local storage
      localStorage.setItem(
        'myFavouriteMovie',
        JSON.stringify(favouriteMovieArray)
      );
    });
}

// rendering Favourite Movies
favouriteBtn.addEventListener('click', function () {
  renderFavourites();
});

function renderFavourites() {
  let count = 1;
  let html = '';
  html += `
    <section class="container">
      <!-- Favourite Section -->
      <div class="fav-section">
        <h3 class="fav-title">Your Favourite Movies & TV shows</h3>
          <!-- movie display -->
          <div class="movie-display">
  `;

  // storing the movies from local storage in a variable
  let moviesFromLocalStorage = JSON.parse(
    localStorage.getItem('myFavouriteMovie')
  );

  if (moviesFromLocalStorage) {
    favouriteMovieArray = moviesFromLocalStorage;

    favouriteMovieArray.forEach(function (movie) {
      html += `
      <div class="fav-movie-list">
        <!-- movie poster -->
        <img src="${
          movie.Poster != 'N/A' ? movie.Poster : './photos/image_not_found.png'
        }" alt="movie poster" class="fav-movie-poster">
        <!-- movie details -->
        <div class="movie-details">
          <div class="star-rating">
            <i class="fa-solid fa-star"></i>
            <p class="imdb-rating">${movie.imdbRating}</p>
            <i class="fa-regular fa-star fav-movie" id="${count}"></i>
          </div>
          <p>${movie.Title}</p>
          <p class="watch-now">Watch Now</p>
          <p class="watch-trailer"><i class="fa-solid fa-play"></i>Trailer</p>
        </div>
      </div>
      `;
      count++;
    });
  }

  // adding the rest of the html
  html += `
        </div>
      </div>
    </section>
  `;
  container.innerHTML = html;
  removeFromFavourites();
}

function removeFromFavourites() {
  // getting the data from local storage
  let moviesFromLocalStorage = JSON.parse(
    localStorage.getItem('myFavouriteMovie')
  );
  if (moviesFromLocalStorage) {
    favouriteMovieArray = moviesFromLocalStorage;
  }

  let favourites = document.getElementsByClassName('fav-movie');

  for (let fav of favourites) {
    fav.addEventListener('click', function (e) {
      let index = e.target.id - 1;

      // removing the item from the array
      favouriteMovieArray.splice(index, 1);
      localStorage.setItem(
        'myFavouriteMovie',
        JSON.stringify(favouriteMovieArray)
      );
      renderFavourites();
    });
  }
}

// movie ids of 10 movies
const movieIdArray = [
  'tt0473445',
  'tt0473449',
  'tt1847521',
  'tt0473453',
  'tt0473454',
  'tt0473455',
  'tt0473456',
  'tt0286716',
  'tt0096895',
  'tt2911666',
];

// Randomly Generate new feature list
let newFeatures = document.getElementById('new-features');

document.addEventListener('DOMContentLoaded', loadTrailers());

function loadTrailers() {
  for (let i = 0; i < 3; i++) {
    fetch(`http://www.omdbapi.com/?i=${movieIdArray[i]}&page=1&apikey=822ca33b`)
      .then((res) => res.json())
      .then((movie) => {
        newFeatures.innerHTML += `
          <!-- trailer section -->
            <div class="trailers">
            <img src="${
              movie.Poster != 'N/A'
                ? movie.Poster
                : './photos/image_not_found.png'
            }" alt="movie poster" class="poster-trailer">
              <div class="trailer-1-desc">
                  <img src="./photos/play.png" alt="play sound">
                  <p class="trailer-title">${movie.Title}</p>
              </div>
            </div>
        `;
      });
  }
}

// Randomly Generate explore section
let exploreSection = document.getElementById('movie-display');

document.addEventListener('DOMContentLoaded', loadExploreSection());

function loadExploreSection() {
  for (let i = 3; i < 10; i++) {
    fetch(`http://www.omdbapi.com/?i=${movieIdArray[i]}&page=1&apikey=822ca33b`)
      .then((res) => res.json())
      .then((movie) => {
        exploreSection.innerHTML += `
          <div class="fav-movie-list">
            <!-- movie poster -->
            <img src="${
              movie.Poster != 'N/A'
                ? movie.Poster
                : './photos/image_not_found.png'
            }" alt="movie poster" class="fav-movie-poster">

            <!-- movie details -->
            <div class="movie-details">
              <div class="star-rating">
                <i class="fa-solid fa-star"></i>
                <p class="imdb-rating">${movie.imdbRating}</p>
                <i class="fa-regular fa-star fav-movie"></i>
              </div>
              <p>${movie.Title}</p>
              <p class="watch-now">Watch Now</p>
              <p class="watch-trailer">
                <i class="fa-solid fa-play"></i>
                Trailer
              </p>
            </div>
          </div>
        `;
      });
  }
}
