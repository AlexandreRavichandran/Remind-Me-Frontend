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

    addListeners: function () {


    },
    displayBookCollection: function (query) {

        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'books?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {
            book.createBookCollection(responseJson);

        })
    },

    createBookCollection: function (responseJson) {
        for (const bookElement of responseJson["hydra:member"]) {
            const bookTemplate = document.querySelector("#bookTemplate");
            const providedBook = bookTemplate.content.cloneNode(true);
            providedBook.querySelector('#title').innerHTML = bookElement.title;
            providedBook.querySelector('#releasedAt').innerHTML = bookElement.releasedAt.split('-')[0];
            providedBook.querySelector('#author').innerHTML = bookElement.author;
            providedBook.querySelector('#picture').setAttribute('src', bookElement.coverUrl)
            providedBook.querySelector('#detailsLink').setAttribute('href', '/books/details?code=' + bookElement.apiCode)
            book.content.appendChild(providedBook);
        }
        book.loadingSpinner.classList.add("d-none");
    },

    displayBookItem: function (apiCode) {
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'books/' + apiCode, config).then(function (response) { return response.json() }).then(function (responseJson) {
            book.createBookItem(responseJson);
        })
    },

    createBookItem: function (responseJson) {
        console.log(responseJson);
        const singleBookTemplate = document.querySelector('#singleBookTemplate');
        const newBookItem = singleBookTemplate.content.cloneNode(true);
        newBookItem.querySelector('#picture').setAttribute('src', responseJson.coverUrl);
        newBookItem.querySelector('#title').innerHTML = responseJson.title;
        newBookItem.querySelector('#author').innerHTML = responseJson.author;
        newBookItem.querySelector('#releaseDate').innerHTML = responseJson.releasedAt;
        newBookItem.querySelector('#apiCode').innerHTML = responseJson.apiCode;
        newBookItem.querySelector('#categories').innerHTML = responseJson.category;
        newBookItem.querySelector('#synopsis').innerHTML = responseJson.synopsis;

        book.content.appendChild(newBookItem);
        book.loadingSpinner.classList.add('d-none');
    }

}