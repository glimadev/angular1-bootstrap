angular.module("CheckAllModule", [])
    .controller("checkboxController", function checkboxController($scope) {
        $scope.checkAll = function (checkAll, items) {
            if (checkAll) {
                checkAll = true;
            } else {
                checkAll = false;
            }
            angular.forEach(items, function (item) {
                item.Selected = checkAll;
            });
        };
    });