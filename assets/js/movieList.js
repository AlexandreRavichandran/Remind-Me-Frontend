const movieList = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#loadingSpinner'),

    addListeners: function () {
        const addToMovieListButton = document.querySelectorAll('.addMovieList');
        for (const button of addToMovieListButton) {
            button.addEventListener('click', movieList.addMovieList);
        }

        const removeMovieListButton = document.querySelectorAll('.removeMovieList');
        if (removeMovieListButton) {
            for (const movieListButton of removeMovieListButton) {
                movieListButton.addEventListener('click', movieList.removeMovieList)
            }
        }
    },

    getMovieList: function (event) {
        movieList.content.innerHTML = "";
        utils.displayLoadingSpinner();
        event.preventDefault();
        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        httpHeaders.append('Content-Type', 'application/json');
        const config = {
            method: 'GET',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'no-cache'
        };
        fetch(app.apiBaseUrl + 'list/movies', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const movie of jsonResponse['hydra:member']) {
                const movieListTemplate = document.querySelector('#movieListTemplate');
                const newMovieList = movieListTemplate.content.cloneNode(true);
                newMovieList.querySelector('#movieTitle').innerHTML = movie.movie.title;
                newMovieList.querySelector('.element').dataset.id = movie.id;
                newMovieList.querySelector('#movieReleasedAt').innerHTML = movie.movie.releasedAt;
                newMovieList.querySelector('#movieListOrder').innerHTML = movie.listOrder;
                newMovieList.querySelector('#moviePicture').setAttribute('src', movie.movie.pictureUrl);
                newMovieList.querySelector('#movieDetailsLink').setAttribute('href', '/movies/details?code=' + movie.movie.apiCode);
                movieList.content.appendChild(newMovieList);
            }
            
            movieList.addListeners();
            movieList.loadingSpinner.classList.add('d-none');
        })
    },

    addMovieList: function (event) {
        event.preventDefault();
        const movieToAdd = event.currentTarget.closest('.element');
        const title = movieToAdd.querySelector('#title').dataset.title;
        const releasedAt = movieToAdd.querySelector('#releasedAt').dataset.releasedAt;
        const apiCode = movieToAdd.dataset.apiCode;
        const pictureUrl = movieToAdd.querySelector('#picture').dataset.pictureUrl;

        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/json');
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const movie = {
            'title': title,
            'releasedAt': releasedAt,
            'apiCode': apiCode,
            'pictureUrl': pictureUrl
        }
        const datas = {
            'movie': movie
        }
        const config = {
            method: 'POST',
            headers: httpHeaders,
            mode: 'cors',
            body: JSON.stringify(datas),
            cache: 'no-cache'
        };

        fetch(app.apiBaseUrl + 'list/movies', config)
            .then(function (response) {
                console.log(response);
            });
    },

    changeMovieOrder: function (event) {

    },

    removeMovieList: function (event) {
        event.preventDefault();
        const movieToDelete = event.currentTarget.closest('.element');
        const movieId = movieToDelete.dataset.id;

        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const config = {
            method: 'DELETE',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'list/movies/' + movieId, config).then(function (response) { console.log(response) })
    }

}