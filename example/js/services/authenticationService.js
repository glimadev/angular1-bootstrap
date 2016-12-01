(function (angular, vitali) {
    'use strict';
    angular.module(vitali.modules.auth.name).factory('authService',
        ['$http', '$rootScope', '$q', 'eventbus', 'SessionService', 'UrlService', 'SweetAlert', '$cookies',
            function ($http, $rootScope, $q, eventbus, sessionService, UrlService, SweetAlert, $cookies) {

                var authServiceFactory = {};

                authServiceFactory.authentication = {
                    isAuth: false,
                    userName: "",
                    useRefreshTokens: false,
                    token: "",//token
                    id: "",//userId
                    login: "",//e-mail
                    name: "",//fullName
                    firstName: "", //firstName,
                    picture: "",//photoUrl,
                    permissions: [], //claims and roles
                    isExternal: false
                };

                authServiceFactory.externalAuthData = {
                    provider: "",
                    userName: "",
                    login: "",
                    picture: "",
                    externalAccessToken: ""
                };

                var _createUser = function (token, user, permissions) {
                    return {
                        token: token,
                        user: {
                            id: user.userId,
                            login: user.userName,
                            name: user.fullName,
                            firstName: user.firstName,
                            picture: user.photoUrl
                        },
                        permissions: permissions
                    };
                }

                var _goToRegister = function (registration) {
                    _clearProcess();

                    authServiceFactory.authentication.name = registration.name;
                    authServiceFactory.authentication.login = registration.login;
                    authServiceFactory.authentication.isExternal = false;
                };

                var _login = function (loginData, callback) {

                    var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;

                    if (loginData.useRefreshTokens) {
                        data = data + "&client_id=" + ngAuthSettings.clientId;
                    }

                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    $http.post(UrlService.getAPI('Token'), data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                        if (loginData.useRefreshTokens) {
                            sessionService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                        }
                        else {
                            sessionService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                        }

                        authServiceFactory.authentication.isAuth = true;
                        authServiceFactory.authentication.userName = loginData.userName;
                        authServiceFactory.authentication.useRefreshTokens = loginData.useRefreshTokens;

                        authServiceFactory.authentication = _createUser(response.access_token, response, JSON.parse(response.roles));

                        $cookies.put($rootScope.cookieName, JSON.stringify(authServiceFactory.authentication));
                        eventbus.broadcast(vitali.modules.auth.events.userLoggedIn, authServiceFactory.authentication);

                        deferred.resolve(authServiceFactory.authentication);

                        $rootScope.isLoading = false;

                        if (callback) callback();

                    }).error(function (err, status) {

                        $rootScope.isLoading = false;

                        _clearProcess();

                        deferred.reject(err);

                        if (err.error_uri && err.error_uri.indexOf('ConfirmEmail') > -1) {
                            _sendEmailActivationAlert(err.error, err.error_description + ', deseja reenviar o e-mail de ativação?', function () {
                                var splited = err.error_uri.split('|');
                                _sendEmailConfimationToken(splited[1]);
                            });
                        }
                        else {
                            _getError(err);
                        }
                    });

                    return deferred.promise;

                };

                var _logOut = function (callback) {

                    var deferred = $q.defer();

                    $http.get(UrlService.getAPI('Account') + '/Logoff', {}, { headers: { 'Authorization': 'Bearer ' + $rootScope.currentLogin.token } }).success(function (response) {
                        _clearProcess();

                        eventbus.broadcast(vitali.modules.auth.events.userLoggedOut);
                        $cookies.remove($rootScope.cookieName);
                        $rootScope.currentLogin = {};

                        if (callback) callback();
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };

                var _clearProcess = function () {
                    sessionService.remove('authorizationData');

                    authServiceFactory.authentication.isAuth = false;
                    authServiceFactory.authentication.userName = "";
                    authServiceFactory.authentication.useRefreshTokens = false;

                    authServiceFactory.externalAuthData.provider = "";
                    authServiceFactory.externalAuthData.userName = "";
                    authServiceFactory.externalAuthData.externalAccessToken = "";
                };

                var _fillAuthData = function () {

                    var authData = sessionService.get('authorizationData');
                    if (authData) {
                        authServiceFactory.authentication.isAuth = true;
                        authServiceFactory.authentication.userName = authData.userName;
                        authServiceFactory.authentication.useRefreshTokens = authData.useRefreshTokens;
                    }

                };

                var _refreshToken = function () {
                    var deferred = $q.defer();

                    var authData = sessionService.get('authorizationData');

                    if (authData) {

                        if (authData.useRefreshTokens) {

                            var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                            sessionService.authorizationData = null;

                            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                                sessionService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                                deferred.resolve(response);

                            }).error(function (err, status) {
                                _clearProcess();
                                deferred.reject(err);
                            });
                        }
                    }

                    return deferred.promise;
                };

                var _obtainAccessToken = function (externalData, callback) {

                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    var data = "grant_type=password&provider=" + externalData.provider + "&externalAccessToken=" + externalData.externalAccessToken;
                    $http.post(UrlService.getAPI('Token'), data, { header: { 'Content-Type': 'x-www-form-urlencoded' } }).success(function (response) {

                        sessionService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                        authServiceFactory.authentication.isAuth = true;
                        authServiceFactory.authentication.userName = response.userName;
                        authServiceFactory.authentication.useRefreshTokens = false;

                        authServiceFactory.authentication = _createUser(response.access_token, response, JSON.parse(response.roles));

                        $cookies.put($rootScope.cookieName, JSON.stringify(authServiceFactory.authentication));
                        eventbus.broadcast(vitali.modules.auth.events.userLoggedIn, authServiceFactory.authentication);

                        deferred.resolve(authServiceFactory.authentication);

                        $rootScope.isLoading = false;

                        if (callback) callback();

                    }).error(function (err, status) {

                        $rootScope.isLoading = false;

                        _clearProcess();
                        deferred.reject(err);

                        if (err.error_uri && err.error_uri.indexOf('ConfirmEmail') > -1) {
                            _sendEmailActivationAlert(err.error, err.error_description + ', deseja reenviar o e-mail de ativação?', function () {
                                var splited = err.error_uri.split('|');
                                _sendEmailConfimationToken(splited[1]);
                            });
                        }
                        else {
                            _getError(err);
                        }

                    });

                    return deferred.promise;

                };

                var _sendEmailConfimationToken = function (userId) {

                    var deferred = $q.defer();

                    $http.get(UrlService.getAPI('Account') + '/SendEmailConfimationToken/' + userId).success(function (response) {
                        _getResponse(response);
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        _clearProcess();
                        deferred.reject(err);
                        _getError(err);

                    });

                    return deferred.promise;
                };

                var _register = function (register, callback) {

                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    $http.post(UrlService.getAPI('Account') + '/Register', register).success(function (response) {
                        _getResponse(response);

                        if (response.success) {
                            sessionService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                            authServiceFactory.authentication.isAuth = true;
                            authServiceFactory.authentication.userName = response.userName;
                            authServiceFactory.authentication.useRefreshTokens = false;

                            if (callback) callback(response);

                            deferred.resolve(response);
                        }

                        $rootScope.isLoading = false;

                    }).error(function (err, status) {

                        $rootScope.isLoading = false;

                        _clearProcess();
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;

                };

                var _forgot = function (forgot, callback) {
                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    $http.post(UrlService.getAPI('Account') + '/Forgot', forgot).success(function (response) {
                        $rootScope.isLoading = false;
                        _getResponse(response);
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        $rootScope.isLoading = false;
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };

                var _refreshUser = function () {
                    $cookies.put($rootScope.cookieName, JSON.stringify($rootScope.currentLogin));
                };

                var _reset = function (reset) {
                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    $http.post(UrlService.getAPI('Account') + '/Reset', reset).success(function (response) {
                        $rootScope.isLoading = false;
                        _getResponse(response);
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        $rootScope.isLoading = false;
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };

                var _confirmation = function (confirm, callback) {
                    var deferred = $q.defer();

                    $http.post(UrlService.getAPI('Account') + '/Confirmation', confirm).success(function (response) {
                        _getResponse(response);
                        deferred.resolve(response);
                        if (response.success) {
                            if (callback) callback();
                        }
                    }).error(function (err, status) {
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };

                var _getCurrentUser = function () {
                    return eventbus.getUser();
                }

                var _checkEmail = function (email, callback) {
                    var deferred = $q.defer();

                    if (!email) if (callback) callback();

                    $http.get(UrlService.getAPI('Account') + '/CheckEmail?id=' + email).success(function (response) {
                        deferred.resolve(response);

                        if (response.success) {
                            if (callback) callback();
                        }
                        else {
                            getErrorMessage(response);
                        }
                    }).error(function (err, status) {
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };

                ////////////////////// error treatment
                function getSuccess(response, title) {
                    SweetAlert.swal({
                        title: 'Sucesso!',
                        text: response.successMessage,
                        html: true,
                        type: 'success'
                    });
                }

                var _getError = function (err) {
                    SweetAlert.swal(err.error, err.error_description, "info");
                }

                var _sendEmailActivationAlert = function (title, message, callback) {
                    SweetAlert.swal({
                        title: title,
                        text: message,
                        type: "info",
                        confirmButtonText: "Sim",
                        cancelButtonClass: "btn-danger",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: true,
                        showCancelButton: true,
                    },
                    function () {
                        callback();
                    });
                }

                var _getResponse = function (response) {
                    if (response.success) {
                        getSuccess(response);
                    } else {
                        getErrorMessage(response);
                    }
                }

                function getErrorMessage(response) {
                    if (response && response.messages) {
                        var textarea = document.createElement("textarea");
                        for (var i = 0; response.messages.length > i; i++) {
                            textarea.value += response.messages[i] + "\n";
                        }
                        var message = textarea.value;

                        SweetAlert.swal("Erro!", message, "info");
                    }
                }
                //////////////////////

                //////////////////////Alugaria methods
                var _registerSeller = function (register, callback) {

                    var deferred = $q.defer();

                    $rootScope.isLoading = true;

                    $http.post(UrlService.getAPI('Account') + '/RegisterSeller', register).success(function (response) {
                        _getResponse(response);

                        if (response.success) {
                            sessionService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                            authServiceFactory.authentication.isAuth = true;
                            authServiceFactory.authentication.userName = response.userName;
                            authServiceFactory.authentication.useRefreshTokens = false;

                            if (callback) callback(response);

                            deferred.resolve(response);
                        }

                        $rootScope.isLoading = false;

                    }).error(function (err, status) {

                        $rootScope.isLoading = false;

                        _clearProcess();
                        _getError(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;

                };
                //////////////////////

                authServiceFactory.login = _login;
                authServiceFactory.logOut = _logOut;
                authServiceFactory.clearProcess = _clearProcess;
                authServiceFactory.fillAuthData = _fillAuthData;
                authServiceFactory.refreshToken = _refreshToken;
                authServiceFactory.obtainAccessToken = _obtainAccessToken;
                authServiceFactory.register = _register;
                authServiceFactory.reset = _reset;
                authServiceFactory.forgot = _forgot;
                authServiceFactory.confirmation = _confirmation;
                authServiceFactory.getCurrentUser = _getCurrentUser;
                authServiceFactory.goToRegister = _goToRegister;
                authServiceFactory.checkEmail = _checkEmail;
                authServiceFactory.registerSeller = _registerSeller;
                authServiceFactory.refreshUser = _refreshUser;

                return authServiceFactory;
            }]);
}(angular, vitali));