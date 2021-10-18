const bookList = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#loadingSpinner'),

    addListeners: function () {

        const addToBookListButtons = document.querySelectorAll('.addBooklist');
        for (const button of addToBookListButtons) {
            button.addEventListener('click', bookList.addBookList);
        }

        const removeBookListButton = document.querySelectorAll('.removeBookList');
        if (removeBookListButton) {
            for (const bookListButton of removeBookListButton) {
                bookListButton.addEventListener('click', bookList.removeBookList)
            }
        }
    },

    getBookList: function (event) {
        bookList.content.innerHTML = "";
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
                newBookList.querySelector('.element').dataset.id = book.id;
                newBookList.querySelector('#bookListOrder').innerHTML = book.listOrder;
                newBookList.querySelector('#bookListTitle').innerHTML = book.book.title;
                newBookList.querySelector('#bookListPicture').setAttribute('src', book.book.pictureUrl);
                newBookList.querySelector('#bookListDetailsLink').setAttribute('href', '/books/details?code=' + book.book.apiCode)
                bookList.content.appendChild(newBookList)
            }
            bookList.loadingSpinner.classList.add('d-none');
            bookList.addListeners();
        })
    },

    addBookList: function (event) {
        event.preventDefault();
        const bookToAdd = event.currentTarget.closest('.element');
        const title = bookToAdd.querySelector('#title').dataset.title;
        const author = bookToAdd.querySelector('#author').dataset.author;
        const releasedAt = bookToAdd.querySelector('#releasedAt').dataset.releasedAt;
        const apiCode = bookToAdd.dataset.apiCode;
        const pictureUrl = bookToAdd.querySelector('#picture').dataset.pictureUrl;

        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/json');
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const book = {
            'title': title,
            'releasedAt': releasedAt,
            'author': author,
            'apiCode': apiCode,
            'pictureUrl': pictureUrl
        }
        const datas = {
            'book': book
        }
        const config = {
            method: 'POST',
            headers: httpHeaders,
            mode: 'cors',
            body: JSON.stringify(datas),
            cache: 'no-cache'
        };

        fetch(app.apiBaseUrl + 'list/books', config)
            .then(function (response) {
                if (response.status === 201) {
                    utils.displayMessage('success', 'Ce livre a bien été ajouté à votre liste');
                } else if (response.status === 400) {
                    utils.displayMessage('danger', 'Une erreur s\'est produite. Cet element est peut etre déja dans votre liste.');
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            });
    },

    changeBookOrder: function (event) {

    },

    removeBookList: function (event) {
        event.preventDefault();
        const bookToDelete = event.currentTarget.closest('.element');
        const bookId = bookToDelete.dataset.id;

        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const config = {
            method: 'DELETE',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'list/books/' + bookId, config).then(function (response) { console.log(response) })
    }


}