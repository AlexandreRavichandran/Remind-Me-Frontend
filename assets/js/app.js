const app = {
    apiBaseUrl: 'https://127.0.0.1:8000/api/',
    currentPage: window.location.href,

    init: function () {
        app.handleUserStatus();
        music.init();
        movie.init();
        book.init();
        user.init();
        list.init();
        app.addListeners();
    },

    addListeners: function () {
        const typeSelect = document.querySelector('#themeSelection');
        if (typeSelect) {
            typeSelect.addEventListener('change', app.changeBackgroundColor);
            typeSelect.addEventListener('change', app.showMusicType);
        }
        const searchForm = document.querySelector('#reseachForm');
        searchForm.addEventListener('submit', app.checkRequest);
    },

    changeBackgroundColor: function (event) {
        const currentSelectValue = event.currentTarget.value;

        const bodyElement = document.querySelector('body');
        const previousColor = bodyElement.style.backgroundColor;
        let newColor = "";

        switch (currentSelectValue) {
            case "movie":
                newColor = "#4CC417"
                break;
            case "music":
                newColor = "#1569C7"
                break;
            case "book":
                newColor = "#C77416"
                break;

            default:
                break;
        }

        bodyElement.animate({ backgroundColor: [previousColor, newColor] }, 500).onfinish = function () {
            bodyElement.style.backgroundColor = newColor;
        }
    },

    showMusicType: function (event) {
        const value = event.currentTarget.value;
        const musicTypeSelection = document.querySelector('#musicType');
        if (value === "music") {
            musicTypeSelection.classList.remove('d-none');
            musicTypeSelection.querySelector('select').setAttribute('name', 'subType')
            musicTypeSelection.querySelector('select').setAttribute('required', '');
        } else {
            musicTypeSelection.querySelector('select').removeAttribute('name');
            musicTypeSelection.querySelector('select').removeAttribute('required');
            if (!musicTypeSelection.classList.contains('d-none')) {
                musicTypeSelection.classList.add('d-none');
            }

        }
    },

    handleUserStatus: function () {
        if (!sessionStorage.getItem('JWT')) {
            document.querySelector('#loginLink').classList.remove('d-none');
        } else {
            document.querySelector('#listLink').classList.remove('d-none');
            document.querySelector('#logoutLink').classList.remove('d-none');
            document.querySelector('#loginLink').classList.add('d-none');
        }
    },

    checkRequest: function (event) {
        event.preventDefault();
        const possibleTypeValues = ['movie', 'music', 'book'];
        const possibleMusicTypeValues = ['artist', 'album', 'song'];
        const form = event.currentTarget;
        let type = form.querySelector('#themeSelection');
        let request = form.querySelector('#q');
        let musicType = form.querySelector('#musicTypeSelection');
        let error = false;
        if (type.value === '' || request.value === '' || !possibleTypeValues.includes(type.value)) {
            error = true;
        } else if (type.value === 'music' && (musicType.value === '' || !possibleMusicTypeValues.includes(musicType.value))) {
            error = true;
        }
        if (error) {
            utils.displayMessage('danger', 'Une erreur s\'est produite.')
            type.value = '';
            request.value = '';
            musicType.value = '';
        } else {
            let destinationLink = '/search.html?type=' + type.value + '&q=' + request.value;
            if (type.value === 'music') {
                destinationLink += '&subType=' + musicType.value;
            }
            window.location.replace(destinationLink);
        }


    }
}

document.addEventListener('DOMContentLoaded', app.init);