(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.pages.name).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when(vitali.modules.pages.routes.home, {
                controller: vitali.modules.pages.controllers.default,
                templateUrl: 'js/modules/pages/html/home.tmpl.html',
                access: {
                    loginRequired: true
                }
            });
        }]);
}(angular, vitali));