app.filter('cpfCnpjFilter', function () {
    return function (item, personType) {
        if (item != null) {
            var formatted = "";

            if (item.length <= 11) {
                //CPF 000.000.000-00
                formatted = filterCPF(item);
            }
            else {
                //CNPJ 00.000.000/0000-00
                formatted = filterCNPJ(item);
            }

            return formatted;
        }
        return '';
    };
});

app.filter('cpfCnpjPersonFilter', function () {
    return function (item, personType) {
        if (item != null) {
            var formatted = "";

            if (personType) {
                //CPF 000.000.000-00
                formatted = filterCPF(item);
            }
            else {
                //CNPJ 00.000.000/0000-00
                formatted = filterCNPJ(item);
            }

            return formatted;
        }
        return '';
    };
});

function filterCPF(item) {
    var x = item.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
    var formatted = (!x[2]) ? x[1] : x[1] + '.' + x[2] + (x[3] ? '.' + x[3] : '') + (x[4] ? '-' + x[4] : '');
    return formatted;
}

function filterCNPJ(item) {
    var x = item.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    var formatted = !x[2] ? x[1] : x[1] + '.' + x[2] + (x[3] ? '.' + x[3] : '') + (x[4] ? '/' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    return formatted;
}