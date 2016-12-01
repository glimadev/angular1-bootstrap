(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('UserLoggedService',
        ['$rootScope',
        function ($rootScope) {
            return {
                getUser: function () {
                    return $rootScope.currentLogin;
                },
                getToken: function () {
                    return $rootScope.currentLogin.token;
                },
                getPermissions: function () {
                    return $rootScope.currentLogin.permissions;
                },
                isLogged: function () {
                    return !angular.equals($rootScope.currentLogin, {}) && $rootScope.currentLogin !== null && $rootScope.currentLogin !== undefined;
                }
            };
        }]);

    function getPermissions($rootScope) {
        return ($rootScope.currentLogin) ? $rootScope.currentLogin.permissions : null;
    }
}(angular, vitali));