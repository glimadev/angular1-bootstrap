'use strict';

app.filter('ignoreAccents', function () {
    return function (items, props) {
        var out = [];

        function removeAccents(value) {
            return value
             .replace(/á/g, 'a').replace(/â/g, 'a').replace(/à/g, 'a').replace(/ã/g, 'a')//a
             .replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e')//e
             .replace(/í/g, 'i').replace(/ï/g, 'i').replace(/ì/g, 'i')//i
             .replace(/ó/g, 'o').replace(/ô/g, 'o').replace(/õ/g, 'a')//o
             .replace(/ú/g, 'u').replace(/ü/g, 'u')//u
             .replace(/ç/g, 'c')//c
             .replace(/\//g, '').replace(/-/g, '')//cnaes
             .replace(/\./g, '')//GARE
        }

        var keys = Object.keys(props);

        if (angular.isArray(items) && keys.length) {
            items.forEach(function (item) {
                var matches = [];

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];

                    var text = removeAccents(props[prop].toLowerCase());

                    if (item[prop]) {
                        var search = removeAccents(item[prop].toString().toLowerCase());

                        if (search.indexOf(text) !== -1) {
                            matches.push(true);
                        }
                        else {
                            matches.push(false);
                        }
                    }
                }

                if (matches.indexOf(false) == -1) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }

        return out;
    };
});