const book = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#searchLoadingSpinner'),

    init: function () {


        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        if (app.currentPage.includes('search.html?type=book')) {
            const query = params.get('q');
            book.displayBookCollection(query);
        }
        if (app.currentPage.includes('books/details')) {
            const apiCode = params.get('code');
            book.displayBookItem(apiCode);
        }

    },

    displayBookCollection: function (query) {

        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'books?q=' + query, config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    const error = {
                        'code': 404
                    };
                    throw error;
                }
            })
            .then(function (responseJson) {
                book.createBookCollection(responseJson);

            })

            .catch(function (error) {
                book.content.innerHTML = '<p class="text-center">Cette recherche n\'a donné aucun résultat. </p>';
                book.loadingSpinner.classList.add("d-none");
            })
    },

    createBookCollection: function (responseJson) {
        for (const bookElement of responseJson["hydra:member"]) {
            const bookTemplate = document.querySelector("#bookTemplate");
            const providedBook = bookTemplate.content.cloneNode(true);

            providedBook.querySelector('.element').dataset.apiCode = bookElement.apiCode;
            providedBook.querySelector('#title').dataset.title = bookElement.title;
            providedBook.querySelector('#author').dataset.author = bookElement.author;
            if (bookElement.coverUrl !== null) {
                providedBook.querySelector('#picture').dataset.pictureUrl = bookElement.coverUrl;
            } else {
                providedBook.querySelector('#picture').dataset.pictureUrl = '/Remind-Me-frontend/assets/img/book_not_found.png';
            }
            providedBook.querySelector('#releasedAt').dataset.releasedAt = bookElement.releasedAt;

            providedBook.querySelector('#title').innerHTML = bookElement.title;
            providedBook.querySelector('#releasedAt').innerHTML = bookElement.releasedAt;
            providedBook.querySelector('#author').innerHTML = bookElement.author;
            if (bookElement.coverUrl !== null) {
                providedBook.querySelector('#picture').setAttribute('src', bookElement.coverUrl)
            } else {
                providedBook.querySelector('#picture').setAttribute('src', '/Remind-Me-frontend/assets/img/book_not_found.png')
            }

            providedBook.querySelector('#detailsLink').setAttribute('href', '/Remind-Me-frontend/books/details?code=' + bookElement.apiCode)
            book.content.appendChild(providedBook);
        }
        bookList.addListeners();
        book.loadingSpinner.classList.add("d-none");
    },

    displayBookItem: function (apiCode) {
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'books/' + apiCode, config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    const error = {
                        'code': 404
                    };
                    throw error;
                }
            })
            .catch(function (error) {
                book.content.innerHTML = '<p class="text-center">Une erreur s\'est produite.</p>'
            })
            .then(function (responseJson) {
                book.createBookItem(responseJson);
            })
    },

    createBookItem: function (responseJson) {
        const singleBookTemplate = document.querySelector('#singleBookTemplate');
        const newBookItem = singleBookTemplate.content.cloneNode(true);
        newBookItem.querySelector('.element').dataset.apiCode = responseJson.apiCode;
        newBookItem.querySelector('#title').dataset.title = responseJson.title;
        newBookItem.querySelector('#author').dataset.author = responseJson.author;
        if (responseJson.coverUrl !== null) {
            newBookItem.querySelector('#picture').dataset.pictureUrl = responseJson.coverUrl;
        } else {
            newBookItem.querySelector('#picture').dataset.pictureUrl = '/Remind-Me-frontend/assets/img/book_not_found.png';
        }
        newBookItem.querySelector('#releasedAt').dataset.releasedAt = responseJson.releasedAt;

        if (responseJson.coverUrl !== null) {
            newBookItem.querySelector('#picture').setAttribute('src', responseJson.coverUrl)
        } else {
            newBookItem.querySelector('#picture').setAttribute('src', '/Remind-Me-frontend/assets/img/book_not_found.png')
        }
        newBookItem.querySelector('#title').innerHTML = responseJson.title;
        newBookItem.querySelector('#author').innerHTML = responseJson.author;
        newBookItem.querySelector('#releasedAt').innerHTML = responseJson.releasedAt;
        newBookItem.querySelector('#apiCode').innerHTML = responseJson.apiCode;
        newBookItem.querySelector('#categories').innerHTML = responseJson.category;
        newBookItem.querySelector('#synopsis').innerHTML = responseJson.synopsis;

        book.content.appendChild(newBookItem);
        book.loadingSpinner.classList.add('d-none');
        bookList.addListeners();
    },

}