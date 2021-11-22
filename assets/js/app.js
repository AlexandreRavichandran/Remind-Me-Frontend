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
        if (app.currentPage.includes('search')) {
            app.fillResearchTitle();
        }
    },

    addListeners: function () {
        const typeSelect = document.querySelector('#themeSelection');
        if (typeSelect) {
            typeSelect.addEventListener('change', app.changeLogo);
            typeSelect.addEventListener('change', app.showMusicType);
        }
        const searchForm = document.querySelector('#researchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', app.checkRequest);
        }
    },
    changeLogo: function (event) {
        const currentSelectValue = event.currentTarget.value;
        const currentPicture = document.querySelector('#logoSpace .active');

        currentPicture.animate({ opacity: [1, 0] }, 500).onfinish = function () {
            currentPicture.classList.add('d-none');
            currentPicture.classList.remove('active');
        }
        let nextPicture = null;
        if (currentSelectValue === 'movie') {
            nextPicture = 'logo_movie';
        } else if (currentSelectValue === 'music') {
            nextPicture = 'logo_music';
        } else if (currentSelectValue === 'book') {
            nextPicture = 'logo_book';
        }
        nextPicture = document.querySelector('#' + nextPicture);
        nextPicture.animate({ opacity: [0, 1] }, 500).onfinish = function () {
            nextPicture.classList.remove('d-none');
            nextPicture.classList.add('active');
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
        const possibleMusicTypeValues = ['album', 'song'];
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


    },
    fillResearchTitle: function () {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const type = params.get('type');
        let typeTranslate = null;

        switch (type) {
            case 'music':
                typeTranslate = 'musique';
                break;
            case 'movie':
                typeTranslate = 'film';
                break;
            case 'book':
                typeTranslate = 'livre';
                break;

        }

        const q = params.get('q');

        document.querySelector('#searchedType').innerHTML = typeTranslate;
        document.querySelector('#searchedQ').innerHTML = '"' + q + '"';
    }
}

document.addEventListener('DOMContentLoaded', app.init);