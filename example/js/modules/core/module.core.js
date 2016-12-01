(function (angular, vitali) {
    'use strict';

    vitali.modules.core = {
        name: 'vitali-core',
        services: {
            eventbus: 'eventbus'
        }
    };

    angular.module(vitali.modules.core.name, []);
}(angular, vitali));