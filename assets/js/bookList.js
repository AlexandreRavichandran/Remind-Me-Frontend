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

        const upToBookListButton = document.querySelectorAll('.upToBookList');
        if (upToBookListButton) {
            for (const button of upToBookListButton) {
                button.addEventListener('click', bookList.changeBookOrder);
            }
        }

        const downToBookListButton = document.querySelectorAll('.downToBookList');
        if (downToBookListButton) {
            for (const button of downToBookListButton) {
                button.addEventListener('click', bookList.changeBookOrder);
            }
        }

    },

    getBookList: function (event) {
        bookList.content.innerHTML = "";
        utils.displayLoadingSpinner();
        event.preventDefault();
        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        httpHeaders.append('content-type', 'application/json');
        const config = {
            method: 'GET',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'no-cache',
        };
        fetch(app.apiBaseUrl + 'list/books', config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
            .then(function (jsonResponse) {
                for (const book of jsonResponse['hydra:member']) {
                    const bookListTemplate = document.querySelector('#bookListTemplate');
                    const newBookList = bookListTemplate.content.cloneNode(true);
                    newBookList.querySelector('.element').dataset.id = book.id;
                    newBookList.querySelector('#bookListAuthor').innerHTML = book.book.author;
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
        const apiCode = bookToAdd.dataset.apiCode;

        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/json');
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const book = {
            'apiCode': apiCode
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
        event.preventDefault();
        const bookToUpdate = event.currentTarget.closest('.element');
        if (event.currentTarget.classList.contains('upToBookList')) {
            bookList.upToList(bookToUpdate);
        } else if (event.currentTarget.classList.contains('downToBookList')) {
            bookList.downToList(bookToUpdate);
        }


    },

    upToList: function (bookToUpdate) {
        const elementPreviousSibling = bookToUpdate.previousElementSibling;

        if (elementPreviousSibling != null) {


            const previousElementId = elementPreviousSibling.dataset.id;
            const currentElementId = bookToUpdate.dataset.id;

            const previousElementOrder = elementPreviousSibling.querySelector('#bookListOrder').innerHTML;
            const currentElementOrder = bookToUpdate.querySelector('#bookListOrder').innerHTML;

            const previousElementNextOrder = parseInt(previousElementOrder) + 1;
            const currentElementNextOrder = parseInt(currentElementOrder) - 1;
            bookList.executeOrderRequest(previousElementId, previousElementNextOrder, currentElementId, currentElementNextOrder, 'top');
        }
    },

    executeOrderRequest: function (previousElementId, previousElementOrder, currentElementId, currentElementOrder, order) {
        let datas = {
            'listOrder': previousElementOrder
        }

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

        fetch(app.apiBaseUrl + 'list/books/' + previousElementId, config)

            .then(function (response) {
                if (response.status === 200) {
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

                fetch(app.apiBaseUrl + 'list/books/' + currentElementId, config)
                    .then(function (response) {
                        if (response.status === 200) {

                            const currentElement = document.querySelector('[data-id="' + currentElementId + '"');
                            const nextElement = document.querySelector('[data-id="' + previousElementId + '"');
                            bookList.displayNewOrder(order, currentElement, nextElement);
                        }
                    })
            })

    },

    downToList: function (bookToUpdate) {

        const elementNextSibling = bookToUpdate.nextElementSibling;

        if (elementNextSibling != null) {


            const nextElementId = elementNextSibling.dataset.id;
            const currentElementId = bookToUpdate.dataset.id;

            const nextElementOrder = elementNextSibling.querySelector('#bookListOrder').innerHTML;
            const currentElementOrder = bookToUpdate.querySelector('#bookListOrder').innerHTML;

            const nextElementNextOrder = parseInt(nextElementOrder) - 1;
            const currentElementNextOrder = parseInt(currentElementOrder) + 1;
            bookList.executeOrderRequest(nextElementId, nextElementNextOrder, currentElementId, currentElementNextOrder, 'bottom');
        }
    },

    displayNewOrder: function (order, currentElement, nextElement) {

        bookList.content.removeChild(currentElement);
        if (order === 'bottom') {
            bookList.content.insertBefore(currentElement, nextElement.nextElementSibling);
            currentElement.querySelector('#bookListOrder').innerHTML++;
            nextElement.querySelector('#bookListOrder').innerHTML--;
        } else if (order === 'top') {
            bookList.content.insertBefore(currentElement, nextElement);
            nextElement.querySelector('#bookListOrder').innerHTML++;
            currentElement.querySelector('#bookListOrder').innerHTML--;
        }
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

        fetch(app.apiBaseUrl + 'list/books/' + bookId, config)
            .then(function (response) {
                if (response.status === 204) {
                    document.querySelector('#bookList').click();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
    }


}