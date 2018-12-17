'use strict';

angular.module('AuthServices', ['ngResource', 'ngStorage']).factory('AuthenticationService', function ($resource, $rootScope, $sessionStorage, $q) {
    /**
       *  User profile resource
       */
    var ip = self.location.host;
    var Profile = $resource('http://'+ip+'/helpdesk/api/auth/:id', { id: '@id' }, {
        login: {
            method: "GET",
            isArray: false
        }
    });

    var auth = {};

    /**
     *  Saves the current user in the root scope
     *  Call this in the app run() method
     */
    auth.init = function () {
        if (auth.isLoggedIn()) {
            $rootScope.user = auth.currentUser();
        }
    };

    auth.login = function (ip_addr) {
        return $q(function (resolve, reject) {
            Profile.login({ id: ip_addr }).$promise
                .then(function (data) {
                    $sessionStorage.user = data;
                    $rootScope.user = $sessionStorage.user;
                    resolve();
                }, function () {
                    reject();
                });
        });
    };

    auth.logout = function () {
        delete $sessionStorage.user;
        delete $rootScope.user;
    };


    auth.checkPermissionForView = function (view) {
        if (!view.requiresAuthentication) {
            return true;
        }

        return userHasPermissionForView(view);
    };


    var userHasPermissionForView = function (view) {
        if (!auth.isLoggedIn()) {
            return false;
        }

        if (!view.permissions || !view.permissions.length) {
            return true;
        }

        return auth.userHasPermission(view.permissions);
    };


    auth.userHasPermission = function (permissions) {
        if (!auth.isLoggedIn()) {
            return false;
        }

        var found = false;
        angular.forEach(permissions, function (permission, index) {
            if ($sessionStorage.user.permissions.indexOf(permission) >= 0) {
                found = true;
                return;
            }
        });

        return found;
    };


    auth.currentUser = function () {
        return $sessionStorage.user;
    };


    auth.isLoggedIn = function () {
        return $sessionStorage.user != null;
    };


    return auth;

    /*
    var service = {};
    var url = 'http://127.0.0.1/helpdesk/api/';

    service.Login = Login;
    service.Logout = Logout;
    service.ipLogin = ipLogin;
    service.ipLogout = ipLogout;
    service.isAuthenticated = isAuthenticated;

    return service;

    function Login(username, password, callback) {
        $http.post('/api/authenticate', { username: username, password: password })
            .success(function (response) {
                // login successful if there's a token in the response
                if (response.token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    $localStorage.currentUser = { username: username, token: response.token };

                    // add jwt token to auth header for all requests made by the $http service
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

                    // execute callback with true to indicate successful login
                    callback(true);
                } else {
                    // execute callback with false to indicate failed login
                    callback(false);
                }
            });
    }

    function Logout() {
        // remove user from local storage and clear http auth header
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
    }

    function ipLogin(ip){
        var data = false;
        return $http.get(url+'auth/' + ip)
            .then(
                function (response) {
                    if (response.data.login === true) {
                        $localStorage.userSession = { 
                                id_user     : response.data.id_user,
                                user        : response.data.user, 
                                ip_address  : response.data.ip_addr,
                                permissions : response.data.role
                            };
                        
                        console.log('Success');
                        data = true;
                    } 
                    else {
                        console.log('Login Failed cause of an issue');
                        data = false;
                    }
                }
        );
        return data;
    }

    function ipLogout(){
        delete $localStorage.userSession;
    }

    function isAuthenticated(){
    
    }
    */
});