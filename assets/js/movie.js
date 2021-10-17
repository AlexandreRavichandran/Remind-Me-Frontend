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

    addListeners: function () {

        
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
            providedMovie.querySelector('#title').innerHTML = movie.title;
            providedMovie.querySelector('#picture').setAttribute('src', movie.coverUrl);
            providedMovie.querySelector('#releasedAt').innerHTML = movie.releasedAt;
            providedMovie.querySelector('#detailsLink').setAttribute('href', '/movies/details?code=' + movie.apiCode)
            content.appendChild(providedMovie);
        }
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
        newMovieItem.querySelector("#picture").setAttribute('src', responseJson.coverUrl);
        newMovieItem.querySelector("#title").innerHTML = responseJson.title;
        newMovieItem.querySelector("#realisator").innerHTML = responseJson.realisator;
        newMovieItem.querySelector("#releasedDate").innerHTML = responseJson.releasedAt;
        newMovieItem.querySelector("#apiCode").innerHTML = responseJson.apiCode;
        newMovieItem.querySelector("#actors").innerHTML = responseJson.actors;
        newMovieItem.querySelector("#categories").innerHTML = responseJson.category;
        newMovieItem.querySelector("#synopsis").innerHTML = responseJson.synopsis;

        movie.content.appendChild(newMovieItem);
        movie.loadingSpinner.classList.add('d-none');
    }

}