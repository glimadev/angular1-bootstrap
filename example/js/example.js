(function (wind) {
    'use strict';

    var example = window.example = window.example || {};

    var rootAsset = 'js/';

    //Modules
    example.modules = {
        app: {
            name: 'app'
        }
    };

    //Assets
    example.angular = {
        getController: function (file) {
            return example.modules.rootAsset + 'controllers/' + file + '.js';
        },
        getService: function (service) {
            return example.modules.rootAsset + 'services/' + service + '.js';
        },
        getDirective: function (directive) {
            return example.modules.rootAsset + 'directives/' + directive + '.js';
        }
    }

}(window));