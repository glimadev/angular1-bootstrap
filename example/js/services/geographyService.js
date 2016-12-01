(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('GeographyService',
        ['$http', 'UrlService',
        function ($http, UrlService) {
            return {
                getDistance: function (point1, point2, scope, callback) {
                    var _url = UrlService.getAPIAction('Geography', 'Distance');

                    var _distance = {
                        point1: { latitude: point1.lat, longitude: point1.lng },
                        point2: { latitude: point2.lat, longitude: point2.lng }
                    };

                    $http({
                        method: 'POST',
                        url: _url,
                        data: _distance
                    }).then(function successCallback(response) {
                        var _data = response.data;

                        if (_data.success) {
                            scope.distance = _data.km;
                        }

                        if (callback) callback();

                    }, function errorCallback(response) {
                        //AlertService.message("", "");
                    });
                },
            };
        }]);
}(angular, vitali));