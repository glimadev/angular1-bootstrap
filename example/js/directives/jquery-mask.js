'use strict';
app.directive('jqueryMask', function () {
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        link: function ($scope, $element, $attributes) {
            $attributes.$observe('jqueryMask', function (value) {
                $element.mask(value);
            });
        }
    };
});