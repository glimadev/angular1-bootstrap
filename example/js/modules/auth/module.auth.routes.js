(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.auth.name).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when(vitali.modules.auth.routes.login, {
                controller: vitali.modules.auth.controllers.login,
                templateUrl: 'js/modules/auth/html/login.tmpl.html'
            });
            $routeProvider.when(vitali.modules.auth.routes.notAuthorised, {
                controller: vitali.modules.auth.controllers.login,
                templateUrl: 'js/modules/auth/html/not-authorised.tmpl.html'
            });

            $routeProvider.otherwise({ redirectTo: vitali.modules.auth.routes.login });
        }]);


}(angular, vitali));