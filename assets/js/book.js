const book = {
    init: function () {
        if (app.currentPage.includes('search.html?type=book')) {
            const loadingSpinner = document.querySelector('#searchLoadingSpinner');
            const searchResultTarget = document.querySelector("#searchResults");
            const bookTemplate = document.querySelector("#bookTemplate");
            fetch('jsonexample/bookexample.json').then(function (response) { return response.json() }).then(function (responseJson) {
                console.log(responseJson);

                for (const movie of responseJson["hydra:member"]) {
                    const providedBook = bookTemplate.content.cloneNode(true);
                    providedBook.querySelector('#bookTitle').innerHTML = movie.title;
                    providedBook.querySelector('#bookReleasedAt').innerHTML = movie.releasedAt.split('-')[0];
                    providedBook.querySelector('#bookAuthor').innerHTML = movie.author;

                    searchResultTarget.appendChild(providedBook);
                }
                loadingSpinner.classList.add("d-none");
            })
        }
    }
}