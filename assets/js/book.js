const book = {
    init: function () {
        if (app.currentPage.includes('search.html?type=book')) {
            const loadingSpinner = document.querySelector('#searchLoadingSpinner');
            const searchResultTarget = document.querySelector("#searchResults");
            const bookTemplate = document.querySelector("#bookTemplate");
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            const query = params.get('q');
            fetch(app.apiBaseUrl + 'books?q=' + query).then(function (response) { return response.json() }).then(function (responseJson) {
                console.log(responseJson);

                for (const book of responseJson["hydra:member"]) {
                    const providedBook = bookTemplate.content.cloneNode(true);
                    providedBook.querySelector('#bookTitle').innerHTML = book.title;
                    providedBook.querySelector('#bookReleasedAt').innerHTML = book.releasedAt.split('-')[0];
                    providedBook.querySelector('#bookAuthor').innerHTML = book.author;
                    providedBook.querySelector('#bookPicture').setAttribute('src',book.coverUrl)
                    providedBook.querySelector('#bookDetailsLink').setAttribute('href', '/books/details?code=' + book.apiCode)
                    searchResultTarget.appendChild(providedBook);
                }
                loadingSpinner.classList.add("d-none");
            })
        }
    }
}