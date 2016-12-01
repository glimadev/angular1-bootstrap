(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory(vitali.modules.core.services.eventbus, [
        '$rootScope',
        '$cookies',
        function ($rootScope, $cookies) {

            var subscribe = function (eventName, callback) {
                return $rootScope.$on(eventName, callback);
            },
            broadcast = function (eventName, data) {
                $rootScope.$emit(eventName, data);
            },
            getUser = function () {
                return ($rootScope.currentLogin || $cookies.getObject($rootScope.cookieName));
            };

            return {
                subscribe: subscribe,
                broadcast: broadcast,
                getUser: getUser,
            };
        }
    ]);
}(angular, vitali));