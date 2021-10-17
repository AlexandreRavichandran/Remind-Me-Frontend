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
        const movieListButton = document.querySelector('#movieList');
        if (movieListButton) {
            movieListButton.addEventListener('click', list.getMovieList);
        }

        const bookListButton = document.querySelector('#bookList');
        if (bookListButton) {
            bookListButton.addEventListener('click', list.getBookList);
        }

        const musicListButton = document.querySelector('#musicList');
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
            cache: 'no-cache'
        };
        fetch(app.apiBaseUrl + 'list/movies', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const movie of jsonResponse['hydra:member']) {
                const movieListTemplate = document.querySelector('#movieListTemplate');
                const newMovieList = movieListTemplate.content.cloneNode(true);
                newMovieList.querySelector('#movieTitle').innerHTML = movie.movie.title;
                newMovieList.querySelector('#movieReleasedAt').innerHTML = movie.movie.releasedAt;
                newMovieList.querySelector('#movieListOrder').innerHTML = movie.listOrder;
                newMovieList.querySelector('#moviePicture').setAttribute('src', movie.movie.pictureUrl);
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
            cache: 'no-cache',
        };
        fetch(app.apiBaseUrl + 'list/musics', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const music of jsonResponse['hydra:member']) {
                const musicListTemplate = document.querySelector('#musicListTemplate');
                const newMusicList = musicListTemplate.content.cloneNode(true);
                newMusicList.querySelector('#musicListTitle').innerHTML = music.music.title;
                newMusicList.querySelector('#musicListType').innerHTML = music.music.type;
                newMusicList.querySelector('#musicListReleasedAt').innerHTML = music.music.releasedAt;
                newMusicList.querySelector('#musicListDetailsLink').setAttribute('href', '/' + music.music.type.toLowerCase() + 's/details?code=' + music.music.apiCode);
                newMusicList.querySelector('#musicListPicture').setAttribute('src', music.music.pictureUrl);
                list.content.appendChild(newMusicList);
                list.loadingSpinner.classList.add('d-none');
            }
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
            cache: 'no-cache',
        };
        fetch(app.apiBaseUrl + 'list/books', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const book of jsonResponse['hydra:member']) {
                const bookListTemplate = document.querySelector('#bookListTemplate');
                const newBookList = bookListTemplate.content.cloneNode(true);
                newBookList.querySelector('#bookListOrder').innerHTML = book.listOrder;
                newBookList.querySelector('#bookListTitle').innerHTML = book.book.title;
                newBookList.querySelector('#bookListPicture').setAttribute('src', book.book.pictureUrl);            
                newBookList.querySelector('#bookListDetailsLink').setAttribute('href', '/books/details?code=' + book.book.apiCode)
                list.content.appendChild(newBookList)
            }
            list.loadingSpinner.classList.add('d-none');
        })
    },


}