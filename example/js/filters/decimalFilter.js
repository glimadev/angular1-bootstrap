app.filter('decimalFilter', function () {
    return function (item) {
        if (item != null) {
            return parseInt(item);
        }
        return '';
    };
});