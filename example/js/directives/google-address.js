'use strict';
app.directive('googleAddress', function () {
    var geocoder = new google.maps.Geocoder();
    var template = '<input type="text" class="form-control" id="address" ng-model="term" ng-change="keypress()" autocomplete="off">' +
                   '<div class="autocomplete-suggestions text-left col-md-16" ng-if="suggestions.length > 0">' +
                        '<div class="autocomplete-suggestion2 col-md-16" ng-repeat="suggestion in suggestions" ng-click="selectSuggestion(suggestion)"><span>{{suggestion.label}}</span></div>' +
                   ' </div>';

    return {
        restrict: 'E',
        scope: {
            model: '=model',
        },
        template: function (elem, attrs) {
            return template;
        },
        controller: ['$scope', function ($scope) {
            $scope.selectSuggestion = function (suggestion) {
                $scope.suggestions = [];
                $scope.model = suggestion;
                $scope.term = suggestion.value;
            }

            $scope.keypress = function () {
                $scope.suggestions = [];

                if ($scope.term.length == 0) {
                    $scope.model = null;
                    return;
                }

                geocoder.geocode({ 'address': $scope.term + ', Brasil', 'region': 'BR' }, function (results, status) {
                    $scope.suggestions = $.map(results, function (item) {
                        var address = {};

                        address.complete = item.formatted_address;
                        address.geolocate = item.geometry.location;

                        item.address_components.forEach(function (o) {
                            if (o.types.indexOf('postal_code') > -1) {
                                address.cep = o.long_name;
                                address.zipcode = o.long_name;
                            } else if (o.types.indexOf('sublocality') > -1) {
                                address.neighborhood = o.long_name;
                            } else if (o.types.indexOf('locality') > -1 || o.types.indexOf('administrative_area_level_2') > -1) {
                                address.city = o.long_name;
                            } else if (o.types.indexOf('administrative_area_level_1') > -1) {
                                address.state = o.short_name;
                                address.stateName = o.long_name;
                            } else if (o.types.indexOf('country') > -1) {
                                address.country = o.short_name;
                                address.countryName = o.long_name;
                            }
                        });

                        if (address.country != 'BR') {
                            return null;
                        }

                        return {
                            addressVM: address,
                            label: item.formatted_address,
                            value: item.formatted_address,
                            lng: item.geometry.location.lng(),
                            lat: item.geometry.location.lat()
                        }
                    });
                    $scope.$apply();
                });
            };
        }],
    };
});