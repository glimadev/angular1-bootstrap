app.filter("booleanFilter", function () {
    return function (item) {
        if (item != null && typeof item === 'boolean') {
            if (item === true) {
                return "Sim";
            } else if (item === false) {
                return "Não";
            }
        }

        if (item != null) {
            return item;
        }

        return "";
    };
});