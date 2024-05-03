// loginRegister.js
var authApp = angular.module('authApp', []);

authApp.controller('AuthController', function($scope, $http, $window) {

    this.login = function() {
        // Assuming "uname" and "pass" are the IDs of your input fields
        var email = document.getElementById('uname').value;
        var password = document.getElementById('pass').value;

        // Make a request to your Node.js server for authentication
        $http.post('http://localhost:3000/login', { email: email, password: password })
            .then(function(response) {
                // Successful login
                $window.alert(response.data);
                $window.open("new_home.html", "_self"); // "_self" opens in the same tab
            })
            .catch(function(error) {
                // Failed login
                $window.alert('Login failed. Please check your credentials.');
                $window.open("register.html", "_self");
            });
    };

});