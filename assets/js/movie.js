const movie = {
    init: function () {
        if (app.currentPage.includes('search.html?type=movie')) {

            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            const query = params.get('q');
            const loadingSpinner = document.querySelector('#searchLoadingSpinner');
            const searchResultTarget = document.querySelector("#searchResults");
            const movieTemplate = document.querySelector("#movieTemplate");
            const config = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };
            
            fetch(app.apiBaseUrl + 'movies?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {

                for (const movie of responseJson["hydra:member"]) {
                    const providedMovie = movieTemplate.content.cloneNode(true);
                    providedMovie.querySelector('#movieTitle').innerHTML = movie.title;
                    providedMovie.querySelector('#moviePicture').setAttribute('src', movie.coverUrl);
                    providedMovie.querySelector('#movieReleasedAt').innerHTML = movie.releasedAt;
                    providedMovie.querySelector('#movieDetailsLink').setAttribute('href', '/movies/details?code=' + movie.apiCode)
                    searchResultTarget.appendChild(providedMovie);
                }
                loadingSpinner.classList.add("d-none");
            })
        }
    }
}