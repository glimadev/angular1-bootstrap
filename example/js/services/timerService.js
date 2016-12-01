(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('TimerService',
        ['$timeout',
        function ($timeout) {
            return {                
                startTimer: function (miliseconds, callback) {
                    var timer = $timeout(function () {
                        $timeout.cancel(timer);                        
                        if (callback) callback();
                    }, miliseconds);
                }
            };
        }]);
}(angular, vitali));