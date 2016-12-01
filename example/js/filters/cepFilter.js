app.filter('cepFilter', function () {
    return function (item) {
        if (item != null) {
            var formatted = "";

            var x = item.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
            formatted = (!x[2]) ? x[1] : x[1] + '-' + x[2];

            return formatted;
        }
        return '';
    };
});