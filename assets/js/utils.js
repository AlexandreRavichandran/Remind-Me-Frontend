const utils = {

    addListeners: function () {
        const alertCloseButton = document.querySelector('.alert .close');
        alertCloseButton.addEventListener('click', utils.hideMessage);
    },

    checkIfUserIsConnected: function () {
        if (!sessionStorage.getItem('JWT')) {
            window.location.replace('/login');
        }
    },

    displayLoadingSpinner: function () {
        document.querySelector('#loadingSpinner').classList.remove('d-none');
    },

    displayMessage: function (status, message) {
        const messageTemplate = document.querySelector('#message');
        let newMessage = messageTemplate.content.cloneNode(true);
        newMessage.querySelector('.alert').classList.add('alert-' + status);
        newMessage.querySelector('#messageSentence').innerHTML = message;
        document.querySelector('header').appendChild(newMessage);
        newMessage = document.querySelector('.alert');
        newMessage.animate({ opacity: ['0', '1'] }, 500).onfinish = function () {
            newMessage.style.opacity = "1";
        }
        utils.addListeners();
    },

    hideMessage: function (e) {
        e.preventDefault();
        const currentMessage = e.currentTarget.closest('.alert');

        currentMessage.animate({ opacity: ['1', '0'] }, 500).onfinish = function () {
            currentMessage.remove();
        }
    }
}

