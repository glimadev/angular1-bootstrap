(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('ApiService',
        ['$http', '$state', '$rootScope', 'UrlService', 'SweetAlert', '$location', '$cookies',
        function ($http, $state, $rootScope, UrlService, SweetAlert, $location, $cookies) {

            function getData(response, prop) {
                response = response.data;
                if (prop) {
                    if (response[prop] === 0 || response[prop] === false || response[prop]) {
                        return response[prop];
                    } else {
                        console.error("Propriedade de retorno não encontrada");
                        return {};
                    }
                } else {
                    return response;
                }

            }

            function getSuccess(response, reloadForm) {
                response = response.data;
                if (response.success) {
                    if (typeof reloadForm === "boolean" && reloadForm) {
                        $state.go($state.current.name, {}, { reload: true });
                    }
                    SweetAlert.swal({ title: 'Sucesso!', text: response.successMessage, html: true, type: 'success' });
                    return {};
                } else {
                    getErrorMessage(response);
                }

                return reloadForm;
            }

            function getErrorMessage(response) {
                if (response && response.messages) {
                    var redirectBack = false;
                    var textarea = document.createElement("textarea");
                    for (var i = 0; response.messages.length > i; i++) {

                        if (response.messages[i] === "Usuário não autorizado") {
                            redirectBack = true;
                        } else {
                            textarea.value += response.messages[i] + "\n";
                        }
                    }
                    var message = textarea.value;

                    SweetAlert.swal("Atenção!", message, "warning");

                    if (redirectBack) {
                        UrlService.redirectBack();
                    }

                } else {
                    message = "Ocorreu um erro desconhecido, volte novamente mais tarde.";
                    SweetAlert.swal("Erro!", message, "error");
                }
            }

            function request(rootScope, http, service, controller, action, data, method, callback, token, responseType) {

                //console.log('url:' + url + ' - callback:' + callback);

                var load = (typeof token == "boolean") ? token : true;

                if (typeof callback == "boolean") {
                    load = callback;
                }

                if (data && !callback) {
                    callback = data;
                }

                var url = null;

                if (action) {
                    if (typeof (action) === "function") {
                        token = callback;
                        callback = action;
                        url = service.getAPI(controller);
                    } else {
                        if (method == "get" && typeof data === 'string' || data instanceof String || typeof data === 'number') {
                            url = service.getAPIAction(controller, action, data);
                        } else {
                            url = service.getAPIAction(controller, action);
                        }
                    }
                } else {
                    url = service.getAPI(controller);
                }

                if (load) {
                    $rootScope.isLoading = true;
                }

                token = (!token || load) ? (rootScope.currentLogin) ? rootScope.currentLogin.token : token : token;

                $http({
                    method: method,
                    url: url,
                    data: data,
                    headers: (token) ? { 'Authorization': 'Bearer ' + token } : "",
                    responseType: responseType || 'json'
                })
                .then(function successCallback(response) {
                    callback(response);
                    $rootScope.isLoading = false;
                }, function errorCallback(response) {
                    console.error(response.data);
                    callback(response);
                    $rootScope.isLoading = false;
                });

            }

            function VerifyStatus(response) {
                if (response.status === 401) {
                    if ($location.$$path.indexOf('app') > -1) {
                        $rootScope.currentLogin = null;
                        $cookies.remove($rootScope.cookieName);
                        UrlService.redirect('app', 'login');
                        return false;
                    }

                    UrlService.redirect('login');
                    return false;
                }
                else if (response.status === 500) {
                    SweetAlert.swal("Erro!", "Ocorreu um erro desconhecido, tente novamente mais tarde.", "error");
                    return false;
                }

                return true;
            }


            function download(data, filename, type) {
                var a = document.createElement("a"),
                    file = new Blob([data], { type: type });
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others
                    var url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            }

            return {
                get: function (controller, action, data, callback, load) {
                    return request($rootScope, $http, UrlService, controller, action, data, "get", callback, load);
                },
                getToken: function (controller, action, data, token, callback) {
                    if (typeof data === "string") {
                        data = { value: data }
                    }
                    return request($rootScope, $http, UrlService, controller, action, data, "get", callback, token);
                },
                getArrayBuffer: function (controller, action, data, callback, load) {
                    return request($rootScope, $http, UrlService, controller, action, data, "post", callback, load, 'arraybuffer');
                },
                post: function (controller, action, data, callback, token) {
                    return request($rootScope, $http, UrlService, controller, action, data, "post", callback, token);
                },
                postToken: function (controller, action, data, token, callback) {
                    return request($rootScope, $http, UrlService, controller, action, data, "post", callback, token);
                },
                put: function (controller, action, data, callback) {
                    return request($rootScope, $http, UrlService, controller, action, data, "put", callback);
                },
                download : download,
                getResponseData: function (response, prop) {
                    if (VerifyStatus(response)) {
                        if (response.data.success) {
                            return getData(response, prop);
                        } else {
                            if (!prop) {
                                return response.data;
                            } else {
                                getErrorMessage(response.data);
                                return {};
                            }
                        }
                    }
                },
                getResponse: function (response, reload) {
                    if (VerifyStatus(response)) {
                        if (response.data.success) {
                            getSuccess(response, reload);
                            return true;
                        } else {
                            getErrorMessage(response.data);
                            return false;
                        }
                    }
                },
                getDate: function (date) {
                    return new Date(date.replace(/(\d{2})[/](\d{2})[/](\d{4})/, "$2/$1/$3"))
                },
            };
        }]);


}(angular, vitali));