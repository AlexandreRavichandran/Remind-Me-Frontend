const list = {

    init: function () {
        if (app.currentPage.includes('/list')) {
            utils.checkIfUserIsConnected();
        }
        list.addListeners();
    },

    addListeners: function () {
        const movieListButton = document.querySelector('#movieList');
        if (movieListButton) {
            movieListButton.addEventListener('click', movieList.getMovieList);
        }

        const bookListButton = document.querySelector('#bookList');
        if (bookListButton) {
            bookListButton.addEventListener('click', bookList.getBookList);
        }

        const musicListButton = document.querySelector('#musicList');
        if (musicListButton) {
            musicListButton.addEventListener('click', musicList.getMusicList);
        }

        
    },





}