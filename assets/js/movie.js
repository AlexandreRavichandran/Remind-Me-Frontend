const movie = {
    init: function () {
        if (app.currentPage.includes('search.html?type=movie')) {
            const loadingSpinner = document.querySelector('#searchLoadingSpinner');
            const searchResultTarget = document.querySelector("#searchResults");
            const movieTemplate = document.querySelector("#movieTemplate");
            fetch('jsonexample/movieexample.json').then(function (response) { return response.json() }).then(function (responseJson) {
                console.log(responseJson);

                for (const movie of responseJson["hydra:member"]) {
                    const providedMovie = movieTemplate.content.cloneNode(true);
                    providedMovie.querySelector('#movieTitle').innerHTML = movie.title;
                    providedMovie.querySelector('#movieReleasedAt').innerHTML = movie.releasedAt.split('-')[0];

                    searchResultTarget.appendChild(providedMovie);
                }
                loadingSpinner.classList.add("d-none");
            })
        }
    }
}