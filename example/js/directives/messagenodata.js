(function (angular, vitali) {
    'use strict';
    app.directive("messagenodata", function () {
        return {
            restrict: 'E',
            scope: {
                message: '@',
            },
            link: function (scope, element, attrs) {
                scope.message = attrs.message;
            },
            template: '<div>' +
                            '<br />' +
                            '<br />' +
                            '<div class="alert alert-danger">' +
                                '{{ message }}' +
                            '</div>' +
                      '</div>'
        }
    });
}(angular, vitali));