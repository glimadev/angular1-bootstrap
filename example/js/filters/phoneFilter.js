app.filter('phoneFilter', function () {
    return function (item) {
        if (item != null) {
            var formatted = "";

            if (item.length == 11) {
                var x = item.replace(/\D/g, '').match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
                formatted = (!x[2]) ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? '-' + x[4] : '');
            }
            else {
                var x = item.replace(/\D/g, '').match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
                formatted = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            }

            return formatted;
        }
        return '';
    };
});