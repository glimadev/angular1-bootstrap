(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('PaginationService',
        ['TimerService', function (TimerService) {
            var callTwice = 0;

            return {
                avoidCallTwice: function (callback) {
                    if (callTwice) {
                        callTwice = 0;
                        return;
                    };
                    callTwice++;

                    TimerService.startTimer(500, function() {
                        callTwice = 0;
                    });

                    return callback();
                },
            };
        }]);
}(angular, vitali));