(function (angular, vitali) {
    'use strict';

    angular.module(vitali.modules.core.name).factory('AddressService',
        ['$http', 'appModule', 'AlertService',
        function ($http, appModule, AlertService) {

            function CallCallback(address, callback) {
                if (!address || address.serviceOff) {
                    AlertService.error('Erro de serviço de CEP', 'Serviço indisponível para busca de CEP');
                }
                else if (!address.serviceOff && address.addressNotFound) {
                    AlertService.error('CEP não encontrado', 'Por favor, verifique seu CEP');
                }

                if (callback) callback(address);
            }

            return {
                getStates: function () {
                    return [
                        {
                            id: "AL",
                            name: "Alagoas"
                        },
                        {
                            id: "AP",
                            name: "Amapá"
                        },
                        {
                            id: "AM",
                            name: "Amazonas"
                        },
                        {
                            id: "BA",
                            name: "Bahia"
                        },
                        {
                            id: "CE",
                            name: "Ceará"
                        },
                        {
                            id: "ES",
                            name: "Espírito Santo"
                        },
                        {
                            id: "DF",
                            name: "Distrito Federal"
                        },
                        {
                            id: "GO",
                            name: "Goiás"
                        },
                        {
                            id: "MA",
                            name: "Maranhão"
                        },
                        {
                            id: "MS",
                            name: "Mato Grosso do Sul"
                        },
                        {
                            id: "MT",
                            name: "Mato Grosso"
                        },
                        {
                            id: "MG",
                            name: "Minas Gerais"
                        },
                        {
                            id: "PA",
                            name: "Pará"
                        },
                        {
                            id: "PB",
                            name: "Paraíba"
                        },
                        {
                            id: "PR",
                            name: "Paraná"
                        },
                        {
                            id: "PE",
                            name: "Pernambuco"
                        },
                        {
                            id: "PI",
                            name: "Piauí"
                        },
                        {
                            id: "RJ",
                            name: "Rio de Janeiro"
                        },
                        {
                            id: "RN",
                            name: "Rio Grande do Norte"
                        },
                        {
                            id: "RS",
                            name: "Rio Grande do Sul"
                        },
                        {
                            id: "RO",
                            name: "Rondônia"
                        },
                        {
                            id: "RR",
                            name: "Roraima"
                        },
                        {
                            id: "SP",
                            name: "São Paulo"
                        },
                        {
                            id: "SC",
                            name: "Santa Catarina"
                        },
                        {
                            id: "SE",
                            name: "Sergipe"
                        },
                        {
                            id: "TO",
                            name: "Tocantins"
                        },
                    ]
                },
                getAddress: function (zipcode, callback) {
                    var address = {};
                    if (zipcode && zipcode.length == 9) {

                        zipcode = zipcode.replace('-', '').replace('.', '');

                        $http({
                            method: 'GET',
                            url: 'https://viacep.com.br/ws/' + zipcode + '/json/'
                        }).then(function successCallback(response) {
                            var viacep = response.data;

                            if (viacep.erro)
                                return CallCallback({ addressNotFound: true }, callback);

                            address.cep = zipcode;
                            address.zipcode = zipcode;
                            address.street = viacep.logradouro;
                            address.neighborhood = viacep.bairro;
                            address.city = viacep.localidade;
                            address.state = viacep.uf;

                            $http({
                                method: 'GET',
                                url: 'https://maps.google.com/maps/api/geocode/json?address=' + address.street + ',' + address.city + ',' + address.neighborhood + ',' + address.state + '&key=' + appModule.maps.key
                            }).then(function successCallback(response) {

                                if (response.status == 200) {
                                    if (response.data.results.length == 0) {
                                        address.addressNotFound = true;
                                    }
                                    else {
                                        var addressAPI = response.data.results[0];
                                        address.notFound = false;

                                        if (!address.geolocate) {

                                            address.complete = addressAPI.formatted_address;
                                            address.geolocate = addressAPI.geometry.location

                                            addressAPI.address_components.forEach(function (o) {
                                                if (o.types.indexOf('country') > -1) {
                                                    address.country = o.short_name;
                                                    address.countryName = o.long_name;
                                                }
                                            });

                                        } else {
                                            address.addressNotFound = true;
                                            address.notFound = true;
                                        }
                                    }
                                } else {
                                    address.addressNotFound = true;
                                    address.notFound = true;
                                }

                                CallCallback(address, callback);

                            }, function errorCallback(response) {
                                address.addressNotFound = true;
                                address.serviceOff = true;

                                CallCallback(address, callback);
                            });

                        }, function errorCallback(response) {
                            //AlertService.message("", "");
                        });
                    }
                },
                getAddressDomain: function (zipcode, scope, states, callback) {
                    $http({
                        method: 'GET',
                        url: 'https://viacep.com.br/ws/' + zipcode + '/json/'
                    }).then(function successCallback(response) {
                        var address = response.data;
                        if (!scope)
                            return address;

                        scope.street = address.logradouro;
                        scope.suburb = address.bairro;
                        scope.cityAddress = address.localidade;
                        angular.forEach(states, function (value, key) {
                            if (value.name == address.uf) {
                                value.selected = true;
                                scope.state = value;
                            }
                        });
                        callback();

                    }, function callback(response) {

                    });
                },
            };
        }]);
}(angular, vitali));