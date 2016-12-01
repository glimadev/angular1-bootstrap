(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('CookieService',
        ['$cookies', function ($cookies) {
            return {
                remove: function (prop) {
                    $cookies.remove(prop);
                },
                set: function (prop, value) {
                    $cookies.put(prop, JSON.stringify(value));
                },
                get: function (prop, defaultValue) {
                    return $cookies.getObject(prop) ? $cookies.getObject(prop) : defaultValue;
                },
            };
        }]);
}(angular, vitali));