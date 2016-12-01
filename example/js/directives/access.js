(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.auth.name).directive('access', [
        vitali.modules.auth.services.authorization,
        function (authorization) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var makeVisible = function () {
                        element.removeClass('hidden');
                    },
                    makeHidden = function () {
                        element.addClass('hidden');
                    },
                    contains = function (a, obj) {
                        for (var i = 0; i < a.length; i++) {
                            if (a[i].replace(' ', '') === obj) {
                                return true;
                            }
                        }
                        return false;
                    },
                    determineVisibility = function (resetFirst) {
                        var result;
                        if (resetFirst) {
                            makeVisible();

                            result = authorization.authorize(true, roles, attrs.accessPermissionType);
                            if (result === vitali.modules.auth.enums.authorised.authorised) {
                                makeVisible();
                            } else {
                                makeHidden();
                            }

                        } else {
                            makeHidden();
                        }
                    },
                    roles = attrs.access.split(',');


                    if (roles.length > 0) {
                        if (!contains(roles, "false")) {
                            determineVisibility(true);
                        } else {
                            determineVisibility(false);
                        }
                    }
                }
            };
        }]);

    angular.module(vitali.modules.auth.name).directive('notAccess', [
        vitali.modules.auth.services.authorization,
        function (authorization) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var makeVisible = function () {
                        element.removeClass('hidden');
                    },
                        makeHidden = function () {
                            element.addClass('hidden');
                        },
                        determineVisibility = function (resetFirst) {
                            var result;
                            if (resetFirst) {
                                makeVisible();
                            }

                            result = authorization.authorize(true, roles, attrs.accessPermissionType);
                            if (result === vitali.modules.auth.enums.authorised.authorised) {
                                makeVisible();
                            } else {
                                makeHidden();
                            }
                        },
                        roles = attrs.access.split(',');


                    if (roles.length === 0) {
                        determineVisibility(true);
                    }
                }
            };
        }]);
}(angular, vitali));