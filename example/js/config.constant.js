(function (app, example) {
    'use strict';

    app.constant('JS_REQUIRES', {

        //*** Scripts
        scripts: {

            //*** Main
            'mainCtrl': example.angular.getController('mainCtrl'),

        },
        //*** angularJS Modules
        modules: [{
            name: 'formBuilder',
            files: [example.angular.getDirective('form-builder'), example.angular.getService('formBuilderService')]
        }]
    });
}(app, example));