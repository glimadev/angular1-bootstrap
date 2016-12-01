app.filter('iso', function () {

    var htmlEntities = function () { };

    htmlEntities.map = {
        "ç": "&#231;",
    };

    htmlEntities.decode = function (string) {
        var entityMap = htmlEntities.map;
        for (var key in entityMap) {
            var entity = entityMap[key];
            var regex = new RegExp(entity, 'g');
            string = string.replace(regex, key);
        }
        string = string.replace(/&quot;/g, '"');
        string = string.replace(/&amp;/g, '&');
        return string;
    }

    htmlEntities.encode = function (string) {
        var entityMap = htmlEntities.map;
        string = string.replace(/&/g, '&amp;');
        string = string.replace(/"/g, '&quot;');
        for (var key in entityMap) {
            var entity = entityMap[key];
            var regex = new RegExp(key, 'g');
            string = string.replace(regex, entity);
        }
        return string;
    }

    return function (item, encode) {
        if (item != null) {
            if (encode) {
                return htmlEntities.encode(item);
            }
            return htmlEntities.decode(item);
        }
        return '';
    };
});
