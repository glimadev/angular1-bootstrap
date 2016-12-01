'use strict';
app.directive('historyBack', function () {
    var templates = {
        button: '<div class="btn-group">' +
                        '<a class="btn btn-primary btn-o btn-back" ng-click="urlService.redirectBack()">' +
                            '<i class="fa fa-arrow-left"></i>' +
                            '<span class="hidden-xs"> Voltar </span>' +
                        '</a>' +
                  '</div>',
        plainText: '<a href="#" ng-click="urlService.redirectBack()" class="back">Voltar</a>'
    }

    return {
        restrict: 'E',
        controller: ['UrlService', '$scope', function (UrlService, $scope) {
            $scope.urlService = UrlService;
        }],
        template: function (elem, attrs) {
            var temp = templates.button;
            if (attrs.template == 'plainText')
                temp = templates.plainText;
            return temp;
        }
    }
});