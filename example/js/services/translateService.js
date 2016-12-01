(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('TranslateService',
        ['$filter', function ($filter) {
            var _service = {};

            _service.translate = function (str) {
                return $filter('translate')(str);
            }

            _service.getPreferredLanguage = function () {
                return window.navigator.userLanguage || window.navigator.language;
            }

            return _service;
        }]);
}(angular, vitali));