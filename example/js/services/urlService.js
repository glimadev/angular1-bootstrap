(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('UrlService',
        ['$http', '$window', '$state', '$location', '$rootScope', 'UrlBase',
        function ($http, $window, $state, $location, $rootScope, UrlBase) {

            var urlbase = location.origin;

            var pathname = location.pathname;

            return {
                getAPI: function (controller, id) {
                    var url = urlbase + "/api/" + controller;
                    url = (!id) ? url : url + "/" + id;
                    return url.replace("#", "");
                },
                getAPIAction: function (controller, action, id) {
                    var url = urlbase + "/api/" + controller + "/" + action;
                    url = (!id) ? url : url + "/" + id;
                    return url.replace("#", "");
                },
                getUrl: function (controller, action, hash) {
                    var url = UrlBase.get() + controller + "/" + action;
                    if (hash)
                        return url;
                    else
                        return url.replace("#", "");
                },
                redirect: function (controller, action, refresh) {
                    var url = urlbase;

                    if (pathname) {                        
                        var p = pathname.substr(1, pathname.length);

                        if (p.indexOf('/') > -1 || pathname.length == 1) {
                            url += pathname.substr(0, pathname.length - 1);
                        } else {
                            url += pathname;
                        }
                    }

                    url += "/#/" + controller;

                    if (action) {
                        url += "/" + action;
                    }

                    window.location = url;

                    if(refresh) window.location.reload();
                },
                redirectHome: function (refresh) {
                    refresh = refresh === true
                    $state.go("app.home", {}, { reload: !refresh });
                },
                reload: function () {
                    $state.go($state.current, {}, { reload: true });
                },
                reloadAll: function () {
                    location.reload();
                },
                redirectBack: function (redirectPageBack, time) {

                    if (!redirectPageBack) {
                        redirectPageBack = -1;
                    } else {
                        redirectPageBack = redirectPageBack * -1;
                    }

                    if (!time) {
                        time = 0;
                    }

                    setTimeout(function () {
                        window.history.go(redirectPageBack);
                    }, time);
                }
            };
        }]);


    angular.module(vitali.modules.core.name).factory('UrlBase', function () {
        return {
            get: function () {
                var url = location.href;
                var baseURL = url.substring(0, url.indexOf('/', 14));


                if (baseURL.indexOf('http://localhost') !== -1) {
                    // Base Url for localhost
                    var urlLocation = location.href;  // window.location.href;
                    var pathname = location.pathname;  // window.location.pathname;
                    var index1 = urlLocation.indexOf(pathname);
                    var index2 = urlLocation.indexOf("/", index1 + 1);
                    var baseLocalUrl = urlLocation.substr(0, index2);

                    return baseLocalUrl + "/";
                }
                else {
                    return baseURL + "/";
                }
            }
        };
    });
}(angular, vitali));