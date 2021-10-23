const user = {

    init: function () {
        user.addListeners();
    },

    addListeners: function () {
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', user.login);
        };
        const logoutLink = document.querySelector("#logoutLink");
        logoutLink.addEventListener('click', user.logout);
    },

    logout: function (event) {
        event.preventDefault();
        sessionStorage.removeItem('JWT');
        window.location.replace('/Remind-Me-frontend/');
    },

    login: function (event) {
        event.preventDefault();
        form = event.currentTarget;
        email = form.querySelector('#email').value;
        password = form.querySelector('#password').value;
        const httpHeaders = new Headers();
        httpHeaders.append('Content-type', 'application/json');
        const datas = {
            'username': email,
            'password': password
        }
        const config = {
            method: 'POST',
            headers: httpHeaders,
            mode: 'cors',
            body: JSON.stringify(datas),
            cache: 'no-cache'
        };

        fetch(app.apiBaseUrl + 'login_check', config)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    utils.displayMessage('danger', 'Votre email ou votre mot de passe est incorrect');
                }
            }).then(function (responseJson) {
                sessionStorage.setItem('JWT', responseJson.token);
                window.location.replace("/Remind-Me-frontend/list");
            })
    }
}