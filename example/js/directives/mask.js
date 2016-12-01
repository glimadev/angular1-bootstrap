'use strict';

app.directive('cepMask', ['$filter', 'appModule', function ($filter, appModule) {
    var number_key = appModule.keyboard;
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            element.bind("keydown keypress keyup", function (event) {
                var value = element.val();
                value = value.replace(/\D/g, '');
                if (value.length >= 8 && number_key.indexOf(event.which) == -1) {
                    event.preventDefault();
                    return;
                }
            });

            ctrl.$formatters.push(function (data) {
                data = (!data) ? "" : new String(data);
                return $filter('cepFilter')(data);
            });

            ctrl.$parsers.push(function (data) {
                data = (!data) ? "" : data;
                var plainNumber = data;
                element.val($filter('cepFilter')(plainNumber));
                return plainNumber;
            });
        }
    };
}]);
app.directive('cpfcnpjMask', ['$filter', 'appModule', function ($filter, appModule) {
    var number_key = appModule.keyboard;
    return {
        require: 'ngModel',
        scope: {
            personType: '=personType'
        },
        link: function (scope, element, attrs, ctrl) {

            element.bind("keydown keypress keyup", function (event) {
                var value = element.val();
                value = value.replace(/\D/g, '');
                if (value.length >= 14 && number_key.indexOf(event.which) == -1) {
                    event.preventDefault();
                    return;
                }
            });

            ctrl.$formatters.push(function (data) {
                data = (!data) ? "" : new String(data);
                return $filter('cpfCnpjPersonFilter')(data, scope.personType);
            });

            ctrl.$parsers.push(function (data) {
                data = (!data) ? "" : data;
                var plainNumber = data.replace(/\D/g, '');
                element.val($filter('cpfCnpjPersonFilter')(plainNumber, scope.personType));
                return plainNumber;
            });
        }
    };
}]);
app.directive('moneyMask', ['$filter',  function ($filter) {
    var precision = 2;
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (data) {
                data = (!data) ? 0 : data;
                var formatted = $filter('currency')(data);
                //convert data from model format to view format
                return formatted; //converted
            });
            ctrl.$parsers.push(function (data) {
                data = (!data) ? "0" : data;
                var plainNumber = data.replace(/[^\d|\-+|\+]/g, '');
                var length = plainNumber.length;
                var intValue = plainNumber.substring(0, length - precision);
                var decimalValue = plainNumber.substring(length - precision, length)
                var decimalValue = (decimalValue.length == 1) ? "0" + decimalValue : decimalValue;
                var plainNumberWithDecimal = intValue + '.' + decimalValue;
                //convert data from view format to model format
                var formatted = $filter('currency')(plainNumberWithDecimal);
                element.val(formatted);
                return Number(plainNumberWithDecimal);
            });
        }
    };
}]);
app.directive('phoneMask', ['$filter', 'appModule', function ($filter, appModule) {
    var number_key = appModule.keyboard;
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            element.bind("keydown keypress keyup", function (event) {
                var value = element.val();
                value = value.replace(/\D/g, '');
                if (value.length >= 11 && number_key.indexOf(event.which) == -1) {
                    event.preventDefault();
                    return;
                }
            });

            ctrl.$formatters.push(function (data) {
                data = (!data) ? "" : new String(data);
                return $filter('phoneFilter')(data);
            });

            ctrl.$parsers.push(function (data) {
                data = (!data) ? "" : data;
                var plainNumber = data.replace(/\D/g, '');
                plainNumber = plainNumber.substr(0, 11)
                element.val($filter('phoneFilter')(plainNumber));
                return plainNumber;
            });
        }
    };
}]);