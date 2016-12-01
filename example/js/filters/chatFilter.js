app.filter('chatFilter', ['$filter', function ($filter) {
    return function (items, parameters) {
        var out = [];
        var count = 0;
        var group = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                if (item['notify'] == parameters.notify || item['justToBadge'] == parameters.justToBadge) {
                    out.push(item)
                }
            });

            if (out) {
                var group = $filter('groupBy')(out, 'idOther');

                if (group['1']) delete group['1'];

                var count = 0;

                var keys = Object.keys(group);

                for (var i = 0; i < keys.length; i++) {
                    group[keys[i]].notify = 0;
                    for (var j = 0; j < group[keys[i]].length; j++) {
                        if (group[keys[i]][j]['notify']) {
                            count += 1;
                            group[keys[i]].notify += 1;
                        }
                    }
                }
            }
        }
        return { group: group, count: count };
    };
}]);