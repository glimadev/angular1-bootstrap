(function (angular, vitali) {
	'use strict';

	vitali.modules.admin = {
		name: 'admin',
		controllers: {
			users: 'userListCtrl'
		},
		routes: {
			users: '/users'
		}
	};

	angular.module(vitali.modules.admin.name, [
		'ngRoute'
	]);


}(angular, vitali));