(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.auth.name).factory(vitali.modules.auth.services.authorization, [
    'authService', 'UserLoggedService',
    function (authentication, userLoggedService) {
        var authorize = function (loginRequired, requiredPermissions, permissionCheckType) {
            var result = vitali.modules.auth.enums.authorised.authorised,
                user = authentication.getCurrentUser(),
                loweredPermissions = [],
                hasPermission = true,
                permission, i;

            loginRequired = (loginRequired); //? loginRequired : true;
            permissionCheckType = permissionCheckType || vitali.modules.auth.enums.permissionCheckType.atLeastOne;
            if (loginRequired === true && (user === undefined || user === null)) {
                result = vitali.modules.auth.enums.authorised.loginRequired;
            } else if (loginRequired == false) {
                result = vitali.modules.auth.enums.authorised.authorised;

            }            else if ((loginRequired === true && user !== undefined) &&
                (requiredPermissions === undefined || requiredPermissions.length === 0)) {
                result = vitali.modules.auth.enums.authorised.authorised;
            } else if (requiredPermissions) {
                loweredPermissions = [];
                angular.forEach(user.permissions, function (permission) {
                    loweredPermissions.push(permission.toLowerCase());
                });

                

                for (i = 0; i < requiredPermissions.length; i += 1) {

                    var containsNot = requiredPermissions[i].indexOf('!') > -1;

                    permission = requiredPermissions[i].toLowerCase().trim().replace('!', '');

                    if (containsNot) {
                        hasPermission = loweredPermissions.indexOf(permission) == -1;
                    } else {
                        hasPermission = loweredPermissions.indexOf(permission) > -1;
                    }

                    if (
                        (hasPermission === false && permissionCheckType === vitali.modules.auth.enums.permissionCheckType.combinationRequired) ||
                        (hasPermission === true && permissionCheckType === vitali.modules.auth.enums.permissionCheckType.atLeastOne)) {
                        break;
                    }
                }

                result = hasPermission ? vitali.modules.auth.enums.authorised.authorised : vitali.modules.auth.enums.authorised.notAuthorised;
            }

            return result;
        };

        var getCurrentUser = function () {
            return authentication.getCurrentUser();
        };

        return {
            authorize: authorize,
            getCurrentUser: getCurrentUser
        };
    }]);
}(angular, vitali));