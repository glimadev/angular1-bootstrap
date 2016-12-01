(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('SessionService',
        ['$sessionStorage', 'appModule',
            function ($sessionStorage, appModule) {
                return {
                    remove: function (prop) {
                        $sessionStorage[prop] = null;
                    },
                    set: function (prop, value) {
                        $sessionStorage[prop] = value;
                    },
                    get: function (prop) {
                        return $sessionStorage[prop];
                    },
                    setHomeInterest: function (value) {
                        $sessionStorage[appModule.sessions.homeInterest] = value;
                    },
                    getHomeInterest: function () {
                        return $sessionStorage[appModule.sessions.homeInterest];
                    },
                    setPurchaserInterest: function (value) {
                        $sessionStorage[appModule.sessions.purchaserInterest] = value;
                    },
                    getPurchaserInterest: function () {
                        return $sessionStorage[appModule.sessions.purchaserInterest];
                    }
                };
            }]);
}(angular, vitali));