const music = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#searchLoadingSpinner'),

    init: function () {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        if (params.get('type') === 'music') {
            music.displayMusicCollection(params.get('subType'), params.get('q'));
        }
        if (window.location.href.indexOf('albums/details') > -1) {

            music.displayMusicItem('album', params.get('code'));

        } else if (window.location.href.indexOf('artists/details') > -1) {

            music.displayMusicItem('artist', params.get('code'));

        } else if (window.location.href.indexOf('songs/details') > -1) {

            music.displayMusicItem('song', params.get('code'));

        }
    },

    displayMusicCollection: function (subType, query) {
        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        };
        fetch(app.apiBaseUrl + 'musics/' + subType + 's?q=' + query, config).then(function (response) { return response.json() }).then(function (responseJson) {
            if (subType === 'album') {
                music.createAlbumCollection(responseJson);
            } else if (subType === 'artist') {
                music.createArtistCollection(responseJson);
            } else if (subType === 'song') {
                music.createSongCollection(responseJson);
            }
        })
    },

    createAlbumCollection: function (element) {
        for (const album of element['hydra:member']) {
            const albumTemplate = document.querySelector('#albumTemplate');
            const providedAlbum = albumTemplate.content.cloneNode(true);
            providedAlbum.querySelector('#albumPicture').setAttribute('src', album.pictureUrl);
            providedAlbum.querySelector('#albumTitle').innerHTML = album.title;
            providedAlbum.querySelector('#albumArtist').innerHTML = album.artist;
            providedAlbum.querySelector('#albumArtist').setAttribute('href', '/artists/details?code=' + album.artistApiCode);
            providedAlbum.querySelector('#albumDetailsLink').setAttribute('href', '/albums/details?code=' + album.apiCode)

            music.content.appendChild(providedAlbum);
        }
        music.loadingSpinner.classList.add('d-none');
    },

    createArtistCollection: function (element) {
        for (const artist of element['hydra:member']) {
            const artistTemplate = document.querySelector('#artistTemplate');
            const providedArtist = artistTemplate.content.cloneNode(true);
            providedArtist.querySelector('#artistPicture').setAttribute('src', artist.pictureUrl);
            providedArtist.querySelector('#artistName').innerHTML = artist.name;
            providedArtist.querySelector('#artistDetailsLink').setAttribute('href', '/artists/details?code=' + artist.apiCode)
            music.content.appendChild(providedArtist);
        }
        music.loadingSpinner.classList.add('d-none');
    },

    createSongCollection: function (element) {
        for (const song of element['hydra:member']) {
            const songTemplate = document.querySelector('#songTemplate');
            const providedSong = songTemplate.content.cloneNode(true);
            providedSong.querySelector('#songTitle').innerHTML = song.title;
            providedSong.querySelector('#songArtist').innerHTML = song.artist;
            providedSong.querySelector('#songArtist').setAttribute('href', '/artist/details?code=' + song.artistApiCode);
            providedSong.querySelector('#songPicture').setAttribute('src', song.pictureUrl);
            providedSong.querySelector('#songPreview').setAttribute('src', song.previewUrl);
            providedSong.querySelector('#songDetailsLink').setAttribute('href', '/songs/details?code=' + song.apiCode)
            music.content.appendChild(providedSong);
        }
        music.loadingSpinner.classList.add('d-none');
    },

    displayMusicItem: function (type, apiCode) {

        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        };

        fetch(app.apiBaseUrl + 'musics/' + type + 's/' + apiCode, config).then(function (response) { return response.json() }).then(function (responseJson) {
            if (type === 'album') {
                music.createAlbumItem(responseJson)
            } else if (type === 'artist') {
                music.createArtistItem(responseJson)
            } else if (type === 'song') {
                music.createSongItem(responseJson)
            }
        })
    },

    createAlbumItem: function (element) {
        const singleAlbumTemplate = document.querySelector('#singleAlbumTemplate');
        const albumItem = singleAlbumTemplate.content.cloneNode(true);
        albumItem.querySelector('#singleAlbumPicture').setAttribute('src', element.pictureUrl);
        albumItem.querySelector('#singleAlbumTitle').innerHTML = element.title;
        albumItem.querySelector('#singleAlbumArtist').innerHTML = element.artist;
        albumItem.querySelector('#singleAlbumReleasedAt').innerHTML = element.releasedAt;
        albumItem.querySelector('#singleAlbumCategory').innerHTML = element.category;
        albumItem.querySelector('#singleAlbumApiCode').innerHTML = element.apiCode;

        const tracklistTarget = albumItem.querySelector('#singleAlbumTracklist');
        for (const track of element.tracklist) {
            const trackElement = document.createElement('li');
            const trackLink = document.createElement('a');
            trackLink.setAttribute('href', '/songs/details?code=' + track.apiCode);
            trackLink.innerHTML = track.title;
            trackLink.classList.add('text-white');
            trackElement.appendChild(trackLink);
            tracklistTarget.appendChild(trackElement);
        }
        music.content.appendChild(albumItem);
        music.loadingSpinner.classList.add('d-none');
    },

    createArtistItem: function (element) {
        console.log(element);
    },

    createSongItem: function (element) {
        const songTemplate = document.querySelector('#singleSongTemplate');
        const songElement = songTemplate.content.cloneNode(true);
        songElement.querySelector('#singleSongArtistPicture').style.backgroundImage = 'url("' + element.artistPictureUrl + '")';
        songElement.querySelector('#singleSongPicture').setAttribute('src', element.pictureUrl);
        songElement.querySelector('#singleSongTitle').innerHTML = element.title;
        songElement.querySelector('#singleSongAlbum').innerHTML = element.album;
        songElement.querySelector('#singleSongReleasedAt').innerHTML = element.releasedAt;
        songElement.querySelector('#singleSongApiCode').innerHTML = element.apiCode;
        songElement.querySelector('#singleSongPreview').setAttribute('src', element.previewUrl);
        songElement.querySelector('#singleSongAlbumDetails').setAttribute('href','/albums/details?code='+element.albumApiCode)

        music.content.appendChild(songElement);
        music.loadingSpinner.classList.add('d-none');
    },
}