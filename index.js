const searchInput = document.getElementById('search-input');
const searchList = document.getElementById('search-list');
const container = document.getElementById('container');
const favouriteBtn = document.getElementById('favourite-btn');


let sampleMovies = [];

async function loadMovies(searchTerm) {
  await fetch(`http://www.omdbapi.com/?t=${searchTerm}&page=1&apikey=56d596e9`)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      displayMovieList(data);
      //   if ((data.Response = 'True')) {
      //   }
    });
}

// loadMovies('batman')

function findMovies() {
  let searchTerm = searchInput.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

// empty string
let html = '';

// empty array
let favouriteMovieArray = [];

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
      // console.log(movie.id);

      // Hides the search list
      searchList.classList.add('hide-search-list');

      // empty the search box
      searchInput.value = '';

      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.id}&page=1&apikey=56d596e9`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
      console.log(movieDetails)
      loadFavourites(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  container.innerHTML = '';
  container.innerHTML = `
        <section class="container" id="container">
        <div class="movie-header">
            <h3 class="movie-title">${details.Title}</h3>

            <div class="runtime">
                <p>${details.Year}</p>
                <p>${details.Runtime}</p>
            </div>

            <div class="star-rating movie-star-rating">
                <i class="fa-solid fa-star"></i>
                <p class="imdb-rating">${details.imdbRating}</p>
                <p class="add-favourite-btn">
                    Add to your favourites<i class="fa-regular fa-star movie-page-star"></i>
                </p>
            </div>
            <!-- hero section -->
            <div class="hero">
                <img src="${
                  details.Poster != 'N/A'
                    ? details.Poster
                    : './photos/image_not_found.png'
                }" alt="movie poster" class="hero-poster">
            </div>
        </div>
            <div class="detailed-summary">
                <p>Genre: <span class="highlight">${details.Genre}</span></p>
                <p>Summary: <span class="highlight">${details.Plot}</span></p> 
                <p>Director <span class="highlight">${
                  details.Director
                }</span></p>
                <p>Writers <span class="highlight">${details.Writer}</span></p>
                <p>Stars <span class="highlight">${details.Actors}</span></p>
            </div>

    `;
}

favouriteBtn.addEventListener('click', function () {
  renderFavourites()
});

function loadFavourites(movie) {
  container.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.value === 'add-favourite-btn') {
      favouriteMovieArray.push(movie.imdbID);
      favouriteMovieArray.push(movie);
    }
  });
}

function renderFavourites() {
  let count = 1;
  let html = '';
  html += `
    <section class="container">
        <!-- Favourite Section -->
        <div class="explore">
            <h3 class="explore-title">Your Favourite Movies & TV shows</h3>
            <!-- movie display -->
            <div class="movie-display">
  `
    favouriteMovieArray.forEach(function(movie) {
      html += `
        <div class="movie-${count}">
                      <!-- movie poster -->
                      <img src="${
                        movie.Poster != 'N/A'
                          ? movie.Poster
                          : './photos/image_not_found.png'
                      }" alt="movie poster">
                      <!-- movie details -->
                      <div class="movie-details">
                          <div class="star-rating">
                              <i class="fa-solid fa-star"></i>
                              <p class="imdb-rating">${movie.imdbRating}</p>
                              <i class="fa-regular fa-star"></i>
                          </div>
                          <p>${movie.Title}</p>
                          <p class="watch-now">Watch Now</p>
                          <p class="watch-trailer"><i class="fa-solid fa-play"></i>Trailer</p>
                      </div>
                  </div>
      `;
      count++;
    })
  html += `
              </div>
        </div>
    </section>
  `;

  container.innerHTML = html;
  
}
