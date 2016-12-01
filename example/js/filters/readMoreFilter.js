app.filter('readMore', ['$sce', function ($sce) {
    return function (text, index) {

        if (text && text.length > index) {
            return text.substring(0, index) + "...";            
        }

        return text;
    };
}]);