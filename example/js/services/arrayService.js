(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('ArrayService',
        [function () {
            return {
                getColumn: function getColumn(matrix, col) {
                    var column = [];
                    for (var i = 0; i < matrix.length; i++) column.push(matrix[i][col]);
                    return column;
                },
                findByProp: function getColumn(matrix, col) {
                    var column = [];
                    for (var i = 0; i < matrix.length; i++) column.push(matrix[i][col]);
                    return column;
                },
            };
        }]);
}(angular, vitali));