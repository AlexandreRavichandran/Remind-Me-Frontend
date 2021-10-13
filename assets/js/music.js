const music = {

    searchResult: document.querySelector('#searchResults'),
    loadingSpinner: document.querySelector('#searchLoadingSpinner'),
    init: function () {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        if (params.get('type') === 'music') {
            const subType = params.get('subType');
            const query = params.get('q');
            const config = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };
            fetch(app.apiBaseUrl + 'musics/' + subType + 's?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {
                if (subType === 'album') {
                    music.createAlbumElement(responseJson);
                } else if (subType === 'artist') {
                    music.createArtistElement(responseJson);
                } else if (subType === 'song') {
                    music.createSongElement(responseJson);
                }
            })
        }
    },

    createAlbumElement: function (element) {
        for (const album of element['hydra:member']) {
            const albumTemplate = document.querySelector('#albumTemplate');
            const providedAlbum = albumTemplate.content.cloneNode(true);
            providedAlbum.querySelector('#albumPicture').setAttribute('src', album.pictureUrl);
            providedAlbum.querySelector('#albumTitle').innerHTML = album.title;
            providedAlbum.querySelector('#albumArtist').innerHTML = album.artist;
            providedAlbum.querySelector('#albumArtist').setAttribute('href', '/artists/details?code=' + album.artistApiCode);
            providedAlbum.querySelector('#albumDetailsLink').setAttribute('href', '/albums/details?code=' + album.apiCode)

            music.searchResult.appendChild(providedAlbum);
        }
        music.loadingSpinner.classList.add('d-none');
    },
    
    createArtistElement: function (element) {
        for (const artist of element['hydra:member']) {
            const artistTemplate = document.querySelector('#artistTemplate');
            const providedArtist = artistTemplate.content.cloneNode(true);
            providedArtist.querySelector('#artistPicture').setAttribute('src', artist.pictureUrl);
            providedArtist.querySelector('#artistName').innerHTML = artist.name;
            providedArtist.querySelector('#artistDetailsLink').setAttribute('href', '/artists/details?code=' + artist.apiCode)
            music.searchResult.appendChild(providedArtist);
        }
        music.loadingSpinner.classList.add('d-none');
    },

    createSongElement: function (element) {
        for (const song of element['hydra:member']) {
            const songTemplate = document.querySelector('#songTemplate');
            const providedSong = songTemplate.content.cloneNode(true);
            providedSong.querySelector('#songTitle').innerHTML = song.title;
            providedSong.querySelector('#songArtist').innerHTML = song.artist;
            providedSong.querySelector('#songArtist').setAttribute('href', '/artist/details?code=' + album.artistApiCode);
            providedSong.querySelector('#songPicture').setAttribute('src', song.pictureUrl);
            providedSong.querySelector('#songPreview').setAttribute('src', song.previewUrl);
            providedSong.querySelector('#songDetailsLink').setAttribute('href', '/songs/details?code=' + song.apiCode)
            music.searchResult.appendChild(providedSong);
        }
        music.loadingSpinner.classList.add('d-none');
    }
}