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

        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        };

        fetch(app.apiBaseUrl + 'movies?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {
            movie.createMovieCollection(responseJson);
        })

    },

    createMovieCollection: function (responseJson) {
        const movieTemplate = document.querySelector("#movieTemplate");
        for (const movie of responseJson["hydra:member"]) {
            const providedMovie = movieTemplate.content.cloneNode(true);
            providedMovie.querySelector('#movieTitle').innerHTML = movie.title;
            providedMovie.querySelector('#moviePicture').setAttribute('src', movie.coverUrl);
            providedMovie.querySelector('#movieReleasedAt').innerHTML = movie.releasedAt;
            providedMovie.querySelector('#movieDetailsLink').setAttribute('href', '/movies/details?code=' + movie.apiCode)
            content.appendChild(providedMovie);
        }
        loadingSpinner.classList.add("d-none");
    },

    displayMovieItem: function (apiCode) {
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        };

        fetch(app.apiBaseUrl + 'movies/' + apiCode, config).then(function (response) { return response.json() }).then(function (responseJson) {
            movie.createMovieItem(responseJson);
        })
    },
    
    createMovieItem: function (responseJson) {
        const singleMovieTemplate = document.querySelector('#singleMovieTemplate');
        const newMovieItem = singleMovieTemplate.content.cloneNode(true);
        newMovieItem.querySelector("#singleMoviePicture").setAttribute('src', responseJson.coverUrl);
        newMovieItem.querySelector("#singleMovieTitle").innerHTML = responseJson.title;
        newMovieItem.querySelector("#singleMovieRealisator").innerHTML = responseJson.realisator;
        newMovieItem.querySelector("#singleMovieReleasedDate").innerHTML = responseJson.releasedAt;
        newMovieItem.querySelector("#singleMovieApiCode").innerHTML = responseJson.apiCode;
        newMovieItem.querySelector("#singleMovieActors").innerHTML = responseJson.actors;
        newMovieItem.querySelector("#singleMovieCategories").innerHTML = responseJson.category;
        newMovieItem.querySelector("#singleMovieSynopsis").innerHTML = responseJson.synopsis;

        movie.content.appendChild(newMovieItem);
        movie.loadingSpinner.classList.add('d-none');
    }

}