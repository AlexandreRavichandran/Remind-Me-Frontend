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

        const upToMovieListButton = document.querySelectorAll('.upToMovieList');
        if (upToMovieListButton) {
            for (const button of upToMovieListButton) {
                button.addEventListener('click', movieList.changeMovieOrder);
            }
        }

        const downToMovieListButton = document.querySelectorAll('.downToMovieList');
        if (downToMovieListButton) {
            for (const button of downToMovieListButton) {
                button.addEventListener('click', movieList.changeMovieOrder);
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
        fetch(app.apiBaseUrl + 'list/movies', config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
            .then(function (jsonResponse) {
                console.log(jsonResponse);
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
                if (response.status === 201) {
                    utils.displayMessage('success', 'Ce film a bien été ajouté à votre liste');
                } else if (response.status === 400) {
                    utils.displayMessage('danger', 'Une erreur s\'est produite. Cet element est peut etre déja dans votre liste.');
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            });
    },

    changeMovieOrder: function (event) {

        event.preventDefault();
        const movieToUpdate = event.currentTarget.closest('.element');
        if (event.currentTarget.classList.contains('upToMovieList')) {
            movieList.upToList(movieToUpdate);
        } else if (event.currentTarget.classList.contains('downToMovieList')) {
            movieList.downToList(movieToUpdate);
        }
    },

    upToList: function (movieToUpdate) {
        const elementPreviousSibling = movieToUpdate.previousElementSibling;

        if (elementPreviousSibling != null) {

            const previousElementId = elementPreviousSibling.dataset.id;
            const currentElementId = movieToUpdate.dataset.id;

            const previousElementOrder = elementPreviousSibling.querySelector('#movieListOrder').innerHTML;
            const currentElementOrder = movieToUpdate.querySelector('#movieListOrder').innerHTML;

            const previousElementNextOrder = parseInt(previousElementOrder) + 1;
            const currentElementNextOrder = parseInt(currentElementOrder) - 1;
            movieList.executeOrderRequest(previousElementId, previousElementNextOrder, currentElementId, currentElementNextOrder, 'top');
        }
    },

    downToList: function (movieToUpdate) {

        const elementNextSibling = movieToUpdate.nextElementSibling;

        if (elementNextSibling != null) {


            const nextElementId = elementNextSibling.dataset.id;
            const currentElementId = movieToUpdate.dataset.id;

            const nextElementOrder = elementNextSibling.querySelector('#movieListOrder').innerHTML;
            const currentElementOrder = movieToUpdate.querySelector('#movieListOrder').innerHTML;

            const nextElementNextOrder = parseInt(nextElementOrder) - 1;
            const currentElementNextOrder = parseInt(currentElementOrder) + 1;
            movieList.executeOrderRequest(nextElementId, nextElementNextOrder, currentElementId, currentElementNextOrder, 'bottom');
        }
    },

    executeOrderRequest: function (previousElementId, previousElementOrder, currentElementId, currentElementOrder, order) {
        let datas = {
            'listOrder': previousElementOrder
        }

        console.log(JSON.stringify(datas));
        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/merge-patch+json');
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));

        let config = {
            method: 'PATCH',
            headers: httpHeaders,
            mode: 'cors',
            body: JSON.stringify(datas),
            cache: 'no-cache'
        };

        fetch(app.apiBaseUrl + 'list/movies/' + previousElementId, config)

            .then(function (response) {
                if (response.status === 200) {
                    console.log('ok1')
                    return response.json();
                } else {
                    throw error;
                }
            })
            .then(function (responseJson) {
                datas = {
                    'listOrder': currentElementOrder
                }

                let config = {
                    method: 'PATCH',
                    headers: httpHeaders,
                    mode: 'cors',
                    body: JSON.stringify(datas),
                    cache: 'no-cache'
                };

                fetch(app.apiBaseUrl + 'list/movies/' + currentElementId, config)
                    .then(function (response) {
                        if (response.status === 200) {

                            const currentElement = document.querySelector('[data-id="' + currentElementId + '"');
                            const nextElement = document.querySelector('[data-id="' + previousElementId + '"');
                            console.log(order);
                            movieList.displayNewOrder(order, currentElement, nextElement);
                        }
                    })
            })

    },
    
    displayNewOrder: function(order, currentElement, nextElement){

        movieList.content.removeChild(currentElement);
        if (order === 'bottom') {
            movieList.content.insertBefore(currentElement, nextElement.nextElementSibling);
            currentElement.querySelector('#movieListOrder').innerHTML++;
            nextElement.querySelector('#movieListOrder').innerHTML--;
        } else if (order === 'top') {
            movieList.content.insertBefore(currentElement, nextElement);
            nextElement.querySelector('#movieListOrder').innerHTML++;
            currentElement.querySelector('#movieListOrder').innerHTML--;
        }
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

        fetch(app.apiBaseUrl + 'list/movies/' + movieId, config)
            .then(function (response) {
                if (response.status === 204) {
                    document.querySelector('#movieList').click();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
    }

}