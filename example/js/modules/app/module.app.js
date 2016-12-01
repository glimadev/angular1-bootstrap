(function (angular, vitali) {

    'use strict';

    app.constant('appModule', {
        maps: {
            key: 'AIzaSyCoRMCFnZOKCPvP80TnFb-nM4T-9QNQmeI',
            lib: 'http://maps.googleapis.com/maps/api/js?v=3.exp&libraries=weather,visualization&key='
        },
        auth: {
            clientId: 'ngAuthApp'
        },
        keyboard: [
            35, //end
            36, //home
            37, //left arrow
            39, //right arrow
            8,  //backspace
            46,  //delete
            9, //tab
            13 //enter
        ],
        langs: [
            { name: 'pt-BR', description: 'Portugês - Brasileiro' },
            { name: 'en-US', description: 'Inglês - Estados Unidos' },
        ],
        pagination: {
            pageSize: parseInt(webConfig.pageSize),
            options: [parseInt(webConfig.pageSize), 50, 100]
        }
    });
}(angular, vitali));