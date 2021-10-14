const app = {
    apiBaseUrl: 'https://127.0.0.1:8000/api/',
    currentPage: window.location.href,

    init: function () {
        music.init();
        movie.init();
        book.init();
        app.addListeners();
    },

    addListeners: function () {
        const typeSelect = document.querySelector('#themeSelection');
        typeSelect.addEventListener('change', app.changeBackgroundColor);
        typeSelect.addEventListener('change', app.showMusicType);
    },

    changeBackgroundColor: function (e) {
        const currentSelectValue = e.currentTarget.value;
        console.log(currentSelectValue);

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
    
    showMusicType: function (e) {
        const value = e.currentTarget.value;
        const musicTypeSelection = document.querySelector('#musicType');
        if (value === "music") {
            musicTypeSelection.classList.remove('d-none');
            musicTypeSelection.querySelector('select').setAttribute('name', 'subType');
        } else {
            musicTypeSelection.querySelector('select').removeAttribute('name');
            if (!musicTypeSelection.classList.contains('d-none')) {
                musicTypeSelection.classList.add('d-none');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', app.init);