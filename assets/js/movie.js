const movie = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#searchLoadingSpinner'),

    init: function () {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        if (app.currentPage.includes('search.html?type=movie')) {
            const query = params.get('q');
            movie.displayMovieCollection(query);
        }
        if (app.currentPage.includes('movies/details')) {

            const apiCode = params.get('code');
            movie.displayMovieItem(apiCode);
        }
    },

    displayMovieCollection: function (query) {
        const httpHeader = new Headers();
        httpHeader.append('Access-Control-Allow-Origin', "*");
        const config = {
            method: 'GET',
            headers: httpHeader,
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'movies?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {
            movie.createMovieCollection(responseJson);
        })

    },

    createMovieCollection: function (responseJson) {
        const movieTemplate = document.querySelector("#movieTemplate");
        for (const movie of responseJson["hydra:member"]) {
            const providedMovie = movieTemplate.content.cloneNode(true);
            providedMovie.querySelector('.element').dataset.apiCode = movie.apiCode;
            providedMovie.querySelector('#title').dataset.title = movie.title;
            providedMovie.querySelector("#picture").dataset.pictureUrl = movie.coverUrl;
            providedMovie.querySelector('#releasedAt').dataset.releasedAt = movie.releasedAt;
            providedMovie.querySelector('#title').innerHTML = movie.title;
            providedMovie.querySelector('#picture').setAttribute('src', movie.coverUrl);
            providedMovie.querySelector('#releasedAt').innerHTML = movie.releasedAt;
            providedMovie.querySelector('#detailsLink').setAttribute('href', '/movies/details?code=' + movie.apiCode)
            content.appendChild(providedMovie);
        }
        movieList.addListeners();
        movie.loadingSpinner.classList.add("d-none");
    },

    displayMovieItem: function (apiCode) {
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'movies/' + apiCode, config).then(function (response) { return response.json() }).then(function (responseJson) {
            movie.createMovieItem(responseJson);
        })
    },

    createMovieItem: function (responseJson) {
        const singleMovieTemplate = document.querySelector('#singleMovieTemplate');
        const newMovieItem = singleMovieTemplate.content.cloneNode(true);
        newMovieItem.querySelector('.element').dataset.apiCode = responseJson.apiCode;
        newMovieItem.querySelector('#picture').dataset.pictureUrl = responseJson.coverUrl;
        newMovieItem.querySelector('#title').dataset.title = responseJson.title;
        newMovieItem.querySelector("#releasedAt").dataset.releasedAt = responseJson.releasedAt;

        newMovieItem.querySelector("#picture").setAttribute('src', responseJson.coverUrl);
        newMovieItem.querySelector("#title").innerHTML = responseJson.title;
        newMovieItem.querySelector("#realisator").innerHTML = responseJson.realisator;
        newMovieItem.querySelector("#releasedAt").innerHTML = responseJson.releasedAt;
        newMovieItem.querySelector("#apiCode").innerHTML = responseJson.apiCode;
        newMovieItem.querySelector("#actors").innerHTML = responseJson.actors;
        newMovieItem.querySelector("#categories").innerHTML = responseJson.category;
        newMovieItem.querySelector("#synopsis").innerHTML = responseJson.synopsis;

        movie.content.appendChild(newMovieItem);
        movie.loadingSpinner.classList.add('d-none');
        movieList.addListeners();
    },

}