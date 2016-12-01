(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('TabService',
        function () {
            var _callback, _scope, _init;

            var show = function (prop) {
                var keys = Object.keys(_scope.tab);

                for (var i = 0; i < keys.length; i++) {
                    _scope.tab[keys[i]] = false;
                }

                _scope.tab[prop] = true;

                if (_callback) _callback();
            }

            return {
                init: function (scope, init, callback) {
                    _callback = callback;
                    _scope = scope;
                    _init = init;

                    show(_init);

                    return show;
                }
            };
        });
}(angular, vitali));