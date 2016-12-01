'use strict';

app.filter('dateFilter', function () {
    return function (item) {
        if (item != null && typeof item === 'string') {
            return new Date(parseInt(item.substr(6)));
        }

        if (item != null) {
            return item;
        }

        return '';
    };
});

app.filter('dateFilterUTC', ['DateService',function (DateService) {
    return function (item) {
        if (item != null && typeof item === 'string') {
            return DateService.dateJsonToDateHtml5(item.substr(6));
        }

        if (item != null) {
            return DateService.toUTC(item);
        }

        return '';
    };
}]);