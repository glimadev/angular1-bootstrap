(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.admin.name).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider.when(vitali.modules.admin.routes.users, {
                controller: vitali.modules.admin.controllers.users,
                templateUrl: 'js/modules/admin/html/users.tmpl.html',
                access: {
                    loginRequired: true,
                    permissions: ['Admin']
                }
            });
        }]);


}(angular, vitali));