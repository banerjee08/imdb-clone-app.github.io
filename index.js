const searchInput = document.getElementById('search-input');
const searchList = document.getElementById('search-list');

async function loadMovies(searchTerm) {
  await fetch(`http://www.omdbapi.com/?t=${searchTerm}&page=1&apikey=56d596e9`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
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

let html = '';

function displayMovieList(movie) {
  searchList.innerHTML = '';
  if (movie.Poster != 'N/A') {
    moviePoster = movie.Poster;
  } else {
    moviePoster = './photos/image_not_found.png';
  }

    if (movie.Response != "False") {
        html += `
        <div class="search-list-item ">
        <div class="search-item-thumbnail">
        <img src="${moviePoster}" alt="Poster of ${movie.Title}">
        </div>
        <div class="search-item-info">
        <div>
        <h4>${movie.Title}</h4>
        <p>${movie.Year}</p>
        </div>
        <div class="add-to-favourites-btn">
        <p>
        Add to favorites
        <i class="fa-regular fa-star"></i>
        </p>
        </div>
        </div>
        </div>
        `;
    }
    searchList.innerHTML = html;
}
