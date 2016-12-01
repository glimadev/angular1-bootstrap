(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('LocalStorageService',
        ['$localStorage', function ($localStorage) {
            return {
                remove: function (prop) {
                    $localStorage[prop] = null;
                },
                set: function (prop, value) {
                    $localStorage[prop] = value;
                },
                get: function (prop) {
                    return $localStorage[prop];
                },
            };
        }]);
}(angular, vitali));