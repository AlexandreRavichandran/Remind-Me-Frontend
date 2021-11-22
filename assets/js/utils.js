const utils = {

    addListeners: function () {
        const alertCloseButtons = document.querySelectorAll('.alert .close');
        for (let i = 0; i < alertCloseButtons.length; i++) {
            alertCloseButtons[i].addEventListener('click', utils.hideMessage);
        }
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
        const messageSpace = document.querySelector('#messageSpace');
        let newMessage = messageTemplate.content.cloneNode(true);
        newMessage.querySelector('.alert').classList.add('alert-' + status);
        newMessage.querySelector('#messageSentence').innerHTML = message;
        messageSpace.appendChild(newMessage);
        newMessage = messageSpace.lastElementChild;
        const numberOfMessages = messageSpace.querySelectorAll('.alert').length;
        if (numberOfMessages > 2) {
            utils.hideMessageAutomatically;
        }
        newMessage.animate({ opacity: ['0', '1'] }, 500).onfinish = function () {
            newMessage.style.opacity = "1";
            window.setTimeout(utils.hideMessageAutomatically, 3000);
        }
        utils.addListeners();
    },

    hideMessage: function (e) {
        e.preventDefault();
        const currentMessage = e.currentTarget.closest('.alert');

        currentMessage.animate({ opacity: ['1', '0'] }, 500).onfinish = function () {
            currentMessage.remove();
        }
    },

    hideMessageAutomatically: function () {
        const firstMessage = document.querySelector('#messageSpace').firstElementChild;

        firstMessage.animate({ opacity: ['1', '0'] }, 500).onfinish = function () {
            firstMessage.remove();
        }
    }

}

