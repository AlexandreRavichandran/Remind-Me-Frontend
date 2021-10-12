const music = {
    init: function () {
        if (app.currentPage.includes('search.html?type=music')) {
            const loadingSpinner = document.querySelector('#searchLoadingSpinner');
            const searchResultTarget = document.querySelector("#searchResults");
            const albumTemplate = document.querySelector("#albumTemplate");
            fetch('jsonexample/musicexample.json').then(function (response) { return response.json() }).then(function (responseJson) {
                console.log(responseJson);

                for (const music of responseJson["hydra:member"]) {
                    const albumElement = albumTemplate.content.cloneNode(true);
                    albumElement.querySelector('#albumTitle').innerHTML = music.title;
                    albumElement.querySelector('#albumArtist').innerHTML = music.artist
                    albumElement.querySelector('#albumCategory').innerHTML = music.category;
                    albumElement.querySelector('#albumReleasedAt').innerHTML = music.releasedAt.split('-')[0];

                    searchResultTarget.appendChild(albumElement);
                }
                loadingSpinner.classList.add("d-none");
            })
        }
    }
}