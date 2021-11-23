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
            mode: 'cors'
        };
        fetch(app.apiBaseUrl + 'musics/' + subType + 's?q=' + query, config)
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

                if (subType === 'album') {
                    music.createAlbumCollection(responseJson);
                } else if (subType === 'artist') {
                    music.createArtistCollection(responseJson);
                } else if (subType === 'song') {
                    music.createSongCollection(responseJson);
                }
            })
            .catch(function (error) {
                music.content.innerHTML = '<p class="text-center">Cette recherche n\'a donné aucun résultat. </p>';
                music.loadingSpinner.classList.add("d-none");
            })
    },

    createAlbumCollection: function (element) {
        for (const album of element['hydra:member']) {
            const albumTemplate = document.querySelector('#albumTemplate');
            const providedAlbum = albumTemplate.content.cloneNode(true);
            providedAlbum.querySelector('.albumElement').dataset.apiCode = album.apiCode;
            providedAlbum.querySelector('#picture').dataset.pictureUrl = album.pictureUrl;
            providedAlbum.querySelector('#title').dataset.title = album.title;
            providedAlbum.querySelector('#artist').dataset.artist = album.artist;

            providedAlbum.querySelector('#picture').setAttribute('src', album.pictureUrl);
            providedAlbum.querySelector('#title').innerHTML = album.title;
            providedAlbum.querySelector('#artist').innerHTML = album.artist;
            providedAlbum.querySelector('#detailsLink').setAttribute('href', '/Remind-Me-frontend/albums/details?code=' + album.apiCode)

            music.content.appendChild(providedAlbum);
        }
        musicList.addListeners();
        music.loadingSpinner.classList.add('d-none');   
    },

    createArtistCollection: function (element) {
        for (const artist of element['hydra:member']) {
            const artistTemplate = document.querySelector('#artistTemplate');
            const providedArtist = artistTemplate.content.cloneNode(true);
            providedArtist.querySelector('#artistPicture').setAttribute('src', artist.pictureUrl);
            providedArtist.querySelector('#artistName').innerHTML = artist.name;
            music.content.appendChild(providedArtist);
        }
        music.loadingSpinner.classList.add('d-none');
    },

    createSongCollection: function (element) {
        for (const song of element['hydra:member']) {
            const songTemplate = document.querySelector('#songTemplate');
            const providedSong = songTemplate.content.cloneNode(true);

            providedSong.querySelector('#title').dataset.title = song.title;
            providedSong.querySelector('#artist').dataset.artist = song.artist;
            providedSong.querySelector('#picture').dataset.pictureUrl = song.pictureUrl;
            providedSong.querySelector('.element').dataset.apiCode = song.apiCode;

            providedSong.querySelector('#title').innerHTML = song.title;
            providedSong.querySelector('#artist').innerHTML = song.artist;
            providedSong.querySelector('#artist').setAttribute('href', '/Remind-Me-frontend/artist/details?code=' + song.artistApiCode);
            providedSong.querySelector('#picture').setAttribute('src', song.pictureUrl);
            providedSong.querySelector('#preview').setAttribute('src', song.previewUrl);
            providedSong.querySelector('#detailsLink').setAttribute('href', '/Remind-Me-frontend/songs/details?code=' + song.apiCode)
            music.content.appendChild(providedSong);
        }
        music.loadingSpinner.classList.add('d-none');
        musicList.addListeners();
    },

    displayMusicItem: function (type, apiCode) {

        const config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'musics/' + type + 's/' + apiCode, config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json()
                } else {
                    const error = {
                        'code': 404
                    };
                    throw error;
                }
            })
            .then(function (responseJson) {
                if (type === 'album') {
                    music.createAlbumItem(responseJson)
                } else if (type === 'artist') {
                    music.createArtistItem(responseJson)
                } else if (type === 'song') {
                    music.createSongItem(responseJson)
                }
            })
            .catch(function (error) {
                music.content.innerHTML = '<p class="text-center">Une erreur s\'est produite</p>';
                music.loadingSpinner.classList.add("d-none");
            })
    },

    createAlbumItem: function (element) {
        const singleAlbumTemplate = document.querySelector('#singleAlbumTemplate');
        const albumItem = singleAlbumTemplate.content.cloneNode(true);

        albumItem.querySelector('.element').dataset.apiCode = element.apiCode;
        albumItem.querySelector('#picture').dataset.pictureUrl = element.pictureUrl;
        albumItem.querySelector('#title').dataset.title = element.title;
        albumItem.querySelector('#artist').dataset.artist = element.artist;
        albumItem.querySelector('#releasedAt').dataset.releasedAt = element.releasedAt;

        albumItem.querySelector('#picture').setAttribute('src', element.pictureUrl);
        albumItem.querySelector('#title').innerHTML = element.title;
        albumItem.querySelector('#artist').innerHTML = element.artist;
        albumItem.querySelector('#releasedAt').innerHTML = element.releasedAt;
        albumItem.querySelector('#category').innerHTML = element.category;
        albumItem.querySelector('#apiCode').innerHTML = element.apiCode;

        const tracklistTarget = albumItem.querySelector('#tracklist');
        for (const track of element.tracklist) {
            const trackElement = document.createElement('li');
            const trackLink = document.createElement('a');
            trackLink.setAttribute('href', '/Remind-Me-frontend/songs/details?code=' + track.apiCode);
            trackLink.innerHTML = track.title;
            trackLink.classList.add('text-white');
            trackElement.appendChild(trackLink);
            tracklistTarget.appendChild(trackElement);
        }
        music.content.appendChild(albumItem);
        music.loadingSpinner.classList.add('d-none');
        musicList.addListeners();
    },

    createArtistItem: function (element) {
    },

    createSongItem: function (element) {
        const songTemplate = document.querySelector('#singleSongTemplate');
        const songElement = songTemplate.content.cloneNode(true);
        songElement.querySelector('.element').dataset.apiCode = element.apiCode;
        songElement.querySelector('#picture').dataset.pictureUrl = element.pictureUrl;
        songElement.querySelector('#title').dataset.title = element.title;
        songElement.querySelector('#artist').dataset.artist = element.artist;
        songElement.querySelector('#releasedAt').dataset.releasedAt = element.releasedAt;

        songElement.querySelector('#artistPicture').style.backgroundImage = 'url("' + element.artistPictureUrl + '")';
        songElement.querySelector('#picture').setAttribute('src', element.pictureUrl);
        songElement.querySelector('#title').innerHTML = element.title;
        songElement.querySelector('#album').innerHTML = element.album;
        songElement.querySelector('#artist').innerHTML = element.artist;
        songElement.querySelector('#releasedAt').innerHTML = element.releasedAt;
        songElement.querySelector('#apiCode').innerHTML = element.apiCode;
        songElement.querySelector('#preview').setAttribute('src', element.previewUrl);
        songElement.querySelector('#albumDetails').setAttribute('href', '/Remind-Me-frontend/albums/details?code=' + element.albumApiCode)

        music.content.appendChild(songElement);
        music.loadingSpinner.classList.add('d-none');
        musicList.addListeners();
    },
}