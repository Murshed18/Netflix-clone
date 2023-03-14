const api_Key = "726cea862651f784f217b64085ca3b8e";
const base_Url = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original/";

const api_Url = {
  tmdb_Api: `${base_Url}/genre/movie/list?api_key=${api_Key}`,
  tmdb_fetch: function (id) {
    return `${base_Url}/discover/movie?api_key=${api_Key}&with_genres=${id}`;
  },
  trending_Fetch: `${base_Url}/discover/movie?api_key=${api_Key}&language=en-US`,
};

function start() {
  trending_Movies();
  Categories();
}

function trending_Movies() {
  movieSelection(api_Url.trending_Fetch, `Trending Now`)
    .then(function (response) {
      const random_Trending = parseInt(Math.random() * response.length);
      create_Trending(response[random_Trending]);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function create_Trending(trendingMovies) {
  const header = document.getElementById(`header`);
  header.style.backgroundImage = `url('${imgPath}${trendingMovies.backdrop_path}')`;
  const header_Title = document.getElementsByClassName(`title`)[0];
  header_Title.innerHTML = trendingMovies.original_title;
  const description = document.getElementsByClassName("description")[0];
  description.innerHTML = `${trendingMovies.overview}`;
}

function Categories() {
  fetch(api_Url.tmdb_Api)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const myList = data.genres;
      if (Array.isArray(myList) && myList.length > 0) {
        myList.forEach(function (myListRecive) {
          movieSelection(
            api_Url.tmdb_fetch(myListRecive.id),
            myListRecive.name
          );
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function movieSelection(categoryUrl, categoriesName) {
  return fetch(categoryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      MoviesPicture = data.results;
      if (Array.isArray(MoviesPicture) && MoviesPicture.length > 0) {
        movie_show(MoviesPicture, categoriesName);
      }
      return MoviesPicture;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function movie_show(MoviesList, CatetoryName) {
  // console.log(MoviesList,CatetoryName);
  const movieContainer = document.querySelector("#main-slider");
  const moviesListHtml = MoviesList.map((item) => {
    return `
            <img src="${imgPath}${item.backdrop_path}" alt="${item.title}">
            `;
  }).join("");

  const moviesSectionHtml = `  
    <div id="main-slider">
      <div class="movie-section">
        <div class="Container category">
          <div class="categorys">
          <h2 class="Category-name">${CatetoryName}</h2>
          </div>
          <div class="categorys-img">
            ${moviesListHtml}
          </div>
        </div>
      </div>
    </div>
        `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHtml;
  movieContainer.append(div);
}

window.addEventListener("load", function () {
  start();
});