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

        const upToMusicListButton = document.querySelectorAll('.upToMusicList');
        if (upToMusicListButton) {
            for (const button of upToMusicListButton) {
                button.addEventListener('click', musicList.changeMusicOrder);
            }
        }

        const downToMusicListButton = document.querySelectorAll('.downToMusicList');
        if (downToMusicListButton) {
            for (const button of downToMusicListButton) {
                button.addEventListener('click', musicList.changeMusicOrder);
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
        fetch(app.apiBaseUrl + 'list/musics', config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
            .then(function (jsonResponse) {
                for (const music of jsonResponse['hydra:member']) {
                    const musicListTemplate = document.querySelector('#musicListTemplate');
                    const newMusicList = musicListTemplate.content.cloneNode(true);
                    newMusicList.querySelector('.element').dataset.id = music.id;
                    newMusicList.querySelector('#musicListTitle').innerHTML = music.music.title;
                    newMusicList.querySelector('#musicListOrder').innerHTML = music.listOrder;
                    newMusicList.querySelector('#musicListReleasedAt').innerHTML = music.music.releasedAt;
                    newMusicList.querySelector('#musicListDetailsLink').setAttribute('href', '/' + music.music.type.toLowerCase() + 's/details?code=' + music.music.apiCode);
                    newMusicList.querySelector('#musicListPicture').setAttribute('src', music.music.pictureUrl);
                    let type = null;
                    switch (music.music.type) {
                        case 'Song':
                            type = 'Chanson'
                            break;
                        case 'Album':
                            type = 'Album'
                            break;
                        case 'Artist':
                            type = 'Artiste'
                            break;
                    }

                    newMusicList.querySelector('#musicListType').innerHTML = type;

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
        event.preventDefault();
        const musicToUpdate = event.currentTarget.closest('.element');
        if (event.currentTarget.classList.contains('upToMusicList')) {
            musicList.upToList(musicToUpdate);
        } else if (event.currentTarget.classList.contains('downToMusicList')) {
            musicList.downToList(musicToUpdate);
        }
    },

    upToList: function (musicToUpdate) {
        const elementPreviousSibling = musicToUpdate.previousElementSibling;

        if (elementPreviousSibling != null) {

            const previousElementId = elementPreviousSibling.dataset.id;
            const currentElementId = musicToUpdate.dataset.id;

            const previousElementOrder = elementPreviousSibling.querySelector('#musicListOrder').innerHTML;
            const currentElementOrder = musicToUpdate.querySelector('#musicListOrder').innerHTML;

            const previousElementNextOrder = parseInt(previousElementOrder) + 1;
            const currentElementNextOrder = parseInt(currentElementOrder) - 1;
            musicList.executeOrderRequest(previousElementId, previousElementNextOrder, currentElementId, currentElementNextOrder, 'top');
        }
    },

    downToList: function (musicToUpdate) {
        const elementNextSibling = musicToUpdate.nextElementSibling;

        if (elementNextSibling != null) {


            const nextElementId = elementNextSibling.dataset.id;
            const currentElementId = musicToUpdate.dataset.id;

            const nextElementOrder = elementNextSibling.querySelector('#musicListOrder').innerHTML;
            const currentElementOrder = musicToUpdate.querySelector('#musicListOrder').innerHTML;

            const nextElementNextOrder = parseInt(nextElementOrder) - 1;
            const currentElementNextOrder = parseInt(currentElementOrder) + 1;
            musicList.executeOrderRequest(nextElementId, nextElementNextOrder, currentElementId, currentElementNextOrder, 'bottom');
        }
    },

    executeOrderRequest: function (previousElementId, previousElementOrder, currentElementId, currentElementOrder, order) {

        let datas = {
            'listOrder': previousElementOrder
        }

        console.log(JSON.stringify(datas));
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
        console.log(app.apiBaseUrl + 'list/musics/' + previousElementId);
        fetch(app.apiBaseUrl + 'list/musics/' + previousElementId, config)

            .then(function (response) {
                if (response.status === 200) {
                    console.log('ok1')
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

                fetch(app.apiBaseUrl + 'list/musics/' + currentElementId, config)
                    .then(function (response) {
                        if (response.status === 200) {
                            const currentElement = document.querySelector('[data-id="' + currentElementId + '"');
                            const nextElement = document.querySelector('[data-id="' + previousElementId + '"');
                            console.log(order);
                            musicList.displayNewOrder(order, currentElement, nextElement);
                        }
                    })
            })

    },

    displayNewOrder: function (order, currentElement, nextElement) {
        musicList.content.removeChild(currentElement);
        if (order === 'bottom') {
            musicList.content.insertBefore(currentElement, nextElement.nextElementSibling);
            currentElement.querySelector('#musicListOrder').innerHTML++;
            nextElement.querySelector('#musicListOrder').innerHTML--;
        } else if (order === 'top') {
            musicList.content.insertBefore(currentElement, nextElement);
            nextElement.querySelector('#musicListOrder').innerHTML++;
            currentElement.querySelector('#musicListOrder').innerHTML--;
        }
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

        fetch(app.apiBaseUrl + 'list/musics/' + musicId, config)
            .then(function (response) {
                if (response.status === 204) {
                    document.querySelector('#musicList').click();
                } else if (response.status === 401) {
                    sessionStorage.removeItem('JWT');
                    window.location.replace('/login');
                }
            })
    }

}