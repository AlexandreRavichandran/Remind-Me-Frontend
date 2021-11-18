const user = {

    init: function () {
        user.addListeners();
        user.redirectIfLogged();
    },

    addListeners: function () {
        const loginForm = document.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', user.login);
        };
        const logoutLink = document.querySelector("#logoutLink");
        logoutLink.addEventListener('click', user.logout);

        const registerForm = document.querySelector('#registerForm');

        if (registerForm) {
            registerForm.addEventListener('submit', user.register);
        }
    },

    logout: function (event) {
        event.preventDefault();
        sessionStorage.removeItem('JWT');
        window.location.replace('/');
    },

    login: function (event) {
        event.preventDefault();
        form = event.currentTarget;
        email = form.querySelector('#email').value;
        password = form.querySelector('#password').value;
        const httpHeaders = new Headers();
        httpHeaders.append('content-type', 'application/json');
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
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                } else {
                    utils.displayMessage('danger', 'Votre email ou votre mot de passe est incorrect');
                }
            }).then(function (responseJson) {
                sessionStorage.setItem('JWT', responseJson.token);
                window.location.replace("/list");
            })
    },

    register: function (event) {
        event.preventDefault();
        const email = event.currentTarget.querySelector('#email');
        const password = event.currentTarget.querySelector('#password');
        const passwordCheck = event.currentTarget.querySelector('#repeatPassword');
        const pseudonym = event.currentTarget.querySelector('#pseudonym');

        if (password.value !== passwordCheck.value) {
            password.value = '';
            passwordCheck.value = '';
            utils.displayMessage('danger', 'Les deux mots de passes ne sont pas identiques. Veuillez réessayer.');
        } else {
            const httpHeaders = new Headers();
            httpHeaders.append('Content-Type', 'application/json');
            const datas = {
                'email': email.value,
                'password': password.value,
                'pseudonym': pseudonym.value
            };
            const config = {
                method: 'POST',
                headers: httpHeaders,
                mode: 'cors',
                cache: 'no-cache',
                body: JSON.stringify(datas)
            };

            fetch(app.apiBaseUrl + 'users', config)
                .then(function (response) {
                    console.log(response.status);
                    if (response.status === 201) {
                        console.log('okok');
                        return response.json();

                    } else if (response.status === 422) {
                        error = {
                            'message': 'Veuillez remplir les champs obligatoires'
                        }
                        throw error;
                    }

                })
                .then(function (responseJson) {
                    console.log(responseJson);
                    sessionStorage.setItem('JWT', responseJson.token);
                    window.location.replace('/');
                })
                .catch(function (error) {
                    console.log('ok');
                    utils.displayMessage('warning', 'Une erreur s\'est produite');
                })
        }
    },

    redirectIfLogged: function () {
        if (app.currentPage.includes('/login') || app.currentPage.includes('/register')) {
            if (sessionStorage.getItem('JWT') !== null) {
                window.location.replace('/');
            }
        }
    }
}