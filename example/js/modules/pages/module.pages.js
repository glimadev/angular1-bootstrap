(function (angular, vitali) {
    'use strict';

    vitali.modules.pages = {
        name: 'pages',
        controllers: {
            default: 'defaultCtrl'
        },
        routes: {
            home: '/app/dashboard'
        }
    };

    angular.module(vitali.modules.pages.name, [
        'ngRoute'
    ]);
}(angular, vitali));