(function (angular, vitali) {
	'use strict';

	vitali.modules.auth = {
		name: 'auth',
		enums: {
			authorised: {
				authorised: 0,
				loginRequired: 1,
				notAuthorised: 2
			},
			permissionCheckType: {
				atLeastOne: 0,
				combinationRequired: 1
			}
		},
		events: {
			userLoggedIn: 'auth:user:loggedIn',
			userLoggedOut: 'auth:user:loggedOut'
		},
		controllers: {
			login: 'loginController'
		},
		services: {
			authentication: 'AuthenticationService',
			authorization: 'AuthorizationService'
		},
		routes: {
			login: '/login',
			notAuthorised: '/not-authorised'
		}
	};

	angular.module(vitali.modules.auth.name, [
		'ngRoute',
		vitali.modules.core.name
	]);


}(angular, vitali));