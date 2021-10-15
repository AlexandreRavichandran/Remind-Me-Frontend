const list = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#loadingSpinner'),

    init: function () {
        if (app.currentPage.includes('/list')) {
            utils.checkIfUserIsConnected();
        }

        list.addListeners();
    },

    addListeners: function () {
        movieListButton = document.querySelector('#movieList');
        if (movieListButton) {
            movieListButton.addEventListener('click', list.getMovieList);
        }

        bookListButton = document.querySelector('#bookList');
        if (bookListButton) {
            bookListButton.addEventListener('click', list.getBookList);
        }

        musicListButton = document.querySelector('#musicList');
        if (musicListButton) {
            musicListButton.addEventListener('click', list.getMusicList);
        }
    },

    getMovieList: function (event) {
        list.content.innerHTML = "";
        utils.displayLoadingSpinner();
        event.preventDefault();
        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        httpHeaders.append('Content-Type', 'application/json');
        const config = {
            method: 'GET',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'default',
        };
        fetch(app.apiBaseUrl + 'list/movies', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const movie of jsonResponse['hydra:member']) {
                const movieListTemplate = document.querySelector('#musicListTemplate');
                const newMovieList = movieListTemplate.content.cloneNode(true);
                newMovieList.querySelector('#movieTitle').innerHTML = movie.movie.title;
                newMovieList.querySelector('#movieReleasedAt').innerHTML = movie.movie.releasedAt;
                newMovieList.querySelector('#movieListOrder').innerHTML = movie.listOrder;
                newMovieList.querySelector('#movieDetailsLink').setAttribute('href', '/movies/details?code=' + movie.movie.apiCode);
                list.content.appendChild(newMovieList);
            }
            list.loadingSpinner.classList.add('d-none');
        })
    },

    getMusicList: function (event) {
        list.content.innerHTML = "";
        utils.displayLoadingSpinner();
        event.preventDefault();
        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        httpHeaders.append('Content-Type', 'application/json');
        const config = {
            method: 'GET',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'default',
        };
        fetch(app.apiBaseUrl + 'list/musics', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            console.log(jsonResponse);
        })
    },

    getBookList: function (event) {
        list.content.innerHTML = "";
        utils.displayLoadingSpinner();
        event.preventDefault();
        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        httpHeaders.append('Content-Type', 'application/json');
        const config = {
            method: 'GET',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'default',
        };
        fetch(app.apiBaseUrl + 'list/books', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const book of jsonResponse['hydra:member']) {
                const bookListTemplate = document.querySelector('#bookListTemplate');
                const newBookList = bookListTemplate.content.cloneNode(true);
                newBookList.querySelector('#bookListOrder').innerHTML = book.listOrder;
                newBookList.querySelector('#bookListTitle').innerHTML = book.book.title;
                newBookList.querySelector('#bookListDetailsLink').setAttribute('href', '/books/details?code=' + book.book.apiCode)
                list.content.appendChild(newBookList)
            }
            list.loadingSpinner.classList.add('d-none');
        })
    },

}