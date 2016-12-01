(function (angular, vitali) {
    'use strict';

angular.module(vitali.modules.auth.name).run([
    '$rootScope',
    '$location',
    vitali.modules.auth.services.authorization,
    function ($rootScope, $location, authorization) {
        var routeChangeRequiredAfterLogin = false,
            loginRedirectUrl;
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var authorised;
            if (routeChangeRequiredAfterLogin && next.originalPath !== vitali.modules.auth.routes.login) {
                routeChangeRequiredAfterLogin = false;
                $location.path(loginRedirectUrl).replace();
            } else if (next.access !== undefined) {
                authorised = authorization.authorize(next.access.loginRequired,
                                                     next.access.permissions,
                                                     next.access.permissionCheckType);
                if (authorised === vitali.modules.auth.enums.authorised.loginRequired) {
                    routeChangeRequiredAfterLogin = true;
                    loginRedirectUrl = next.originalPath;
                    $location.path(vitali.modules.auth.routes.login);
                } else if (authorised === vitali.modules.auth.enums.authorised.notAuthorised) {
                    $location.path(vitali.modules.auth.routes.notAuthorised).replace();
                }
            }
        });
    }]);
}(angular, vitali));