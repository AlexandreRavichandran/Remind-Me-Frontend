const musicList = {

    content: document.querySelector('#content'),
    loadingSpinner: document.querySelector('#loadingSpinner'),

    addListeners: function () {
        const addMusicListButton = document.querySelectorAll('.addMusicList');
        if (addMusicListButton) {
            for (const musicListButton of addMusicListButton) {
                musicListButton.addEventListener('click', musicList.addMusicList);
            }
        }

        const removeMusicListButton = document.querySelectorAll('.removeMusicList');
        if (removeMusicListButton) {
            for (const musicListButton of removeMusicListButton) {
                musicListButton.addEventListener('click', musicList.removeMusicList)
            }
        }
    },

    getMusicList: function (event) {
        musicList.content.innerHTML = "";
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
        fetch(app.apiBaseUrl + 'list/musics', config).then(function (response) { return response.json() }).then(function (jsonResponse) {
            for (const music of jsonResponse['hydra:member']) {
                const musicListTemplate = document.querySelector('#musicListTemplate');
                const newMusicList = musicListTemplate.content.cloneNode(true);
                newMusicList.querySelector('.element').dataset.id = music.id;
                newMusicList.querySelector('#musicListTitle').innerHTML = music.music.title;
                newMusicList.querySelector('#musicListType').innerHTML = music.music.type;
                newMusicList.querySelector('#musicListOrder').innerHTML = music.listOrder;
                newMusicList.querySelector('#musicListReleasedAt').innerHTML = music.music.releasedAt;
                newMusicList.querySelector('#musicListDetailsLink').setAttribute('href', '/' + music.music.type.toLowerCase() + 's/details?code=' + music.music.apiCode);
                newMusicList.querySelector('#musicListPicture').setAttribute('src', music.music.pictureUrl);
                musicList.content.appendChild(newMusicList);
                musicList.loadingSpinner.classList.add('d-none');
                musicList.addListeners();
            }
        })
    },

    addMusicList: function (event) {

        event.preventDefault();
        const elementToAdd = event.currentTarget.closest('.element');
        const elementType = elementToAdd.dataset.type;
        const elementApiCode = elementToAdd.dataset.apiCode;
        const elementTitle = elementToAdd.querySelector('#title').dataset.title;
        const elementPicture = elementToAdd.querySelector('#picture').dataset.pictureUrl;
        let elementArtist = null;
        if (elementType !== 'Artist') {
            elementArtist = elementToAdd.querySelector('#artist').dataset.artist;
        }

        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/json');
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const music = {
            'title': elementTitle,
            'releasedAt': 2002,
            'type': elementType,
            'artist': elementArtist,
            'apiCode': elementApiCode,
            'pictureUrl': elementPicture
        }
        const datas = {
            'music': music
        }
        const config = {
            method: 'POST',
            headers: httpHeaders,
            mode: 'cors',
            body: JSON.stringify(datas),
            cache: 'no-cache'
        };

        fetch(app.apiBaseUrl + 'list/musics', config)
            .then(function (response) {
                if (response.status === 201) {
                    utils.displayMessage('success', 'Cette musique a bien été ajouté à votre liste');
                } else if (response.status === 400) {
                    utils.displayMessage('danger', 'Une erreur s\'est produite. Cet element est peut etre déja dans votre liste.');
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            });
    },

    changeMusicOrder: function (event) {

    },

    removeMusicList: function (event) {
        event.preventDefault();
        const musicToDelete = event.currentTarget.closest('.element');
        const musicId = musicToDelete.dataset.id;

        httpHeaders = new Headers();
        httpHeaders.append('Authorization', 'Bearer ' + sessionStorage.getItem('JWT'));
        const config = {
            method: 'DELETE',
            headers: httpHeaders,
            mode: 'cors',
            cache: 'no-cache',
        };

        fetch(app.apiBaseUrl + 'list/musics/' + musicId, config).then(function (response) { console.log(response) })
    }

}