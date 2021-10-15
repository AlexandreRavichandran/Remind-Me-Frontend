const utils = {

    checkIfUserIsConnected: function () {
        if (!sessionStorage.getItem('JWT')) {
            window.location.replace('/login');
        }
    },

    displayLoadingSpinner: function () {
        document.querySelector('#loadingSpinner').classList.remove('d-none');
    }
}