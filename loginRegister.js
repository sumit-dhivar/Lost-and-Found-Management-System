var authApp = angular.module('authApp', []);

authApp.controller('AuthController', function ($scope, $http, $window) {
    this.registerData = {};

    this.register = function () {
        $http.post('http://localhost:3000/register', this.registerData)
            .then(function (response) {
                // Assuming a successful registration, show a pop-up message
                $window.alert('You have successfully registered!');

                // Redirect to the login page
                $window.location.href = 'login.html';
            })
            .catch(function (error) {
                // Handle registration error
                console.error('Registration error:', error);
                $window.alert('Registration failed. Please try again.');
            });
    };

    // Your existing logout and other controller methods go here
});